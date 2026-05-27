/**
 * Migrates the demo user's data from the development database to production.
 * Files and images (contentType = FILE) are excluded — those live in Cloudflare R2.
 *
 * Usage:
 *   npx tsx scripts/migrate-demo-to-prod.ts
 *
 * Reads dev DB from DATABASE_URL in .env
 * Reads prod DB from DATABASE_URL in .env.prod
 *
 * Safe to re-run: clears and re-seeds the demo user's items and collections each time.
 * Does NOT touch item_types — prod's seed already creates those.
 */

import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const DEMO_EMAIL = 'demo@devnest.io';

function makeClient(url: string) {
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}

async function main() {
  const devUrl = process.env.DATABASE_URL;
  if (!devUrl) throw new Error('DATABASE_URL not found in .env');

  const prodEnvPath = path.resolve(process.cwd(), '.env.prod');
  if (!fs.existsSync(prodEnvPath)) throw new Error('.env.prod not found');
  const prodUrl = dotenv.parse(fs.readFileSync(prodEnvPath)).DATABASE_URL;
  if (!prodUrl) throw new Error('DATABASE_URL not found in .env.prod');

  const devDb = makeClient(devUrl);
  const prodDb = makeClient(prodUrl);

  try {
    // ── 1. Read demo user from dev ────────────────────────────────────────────

    const devUser = await devDb.user.findUnique({ where: { email: DEMO_EMAIL } });
    if (!devUser) throw new Error(`Demo user (${DEMO_EMAIL}) not found in dev DB`);
    console.log(`Source user: ${devUser.email} (${devUser.id})`);

    // Fetch items with their type and tags included so we get type info even if
    // the item_type rows are not directly owned by the user (e.g. userId = null).
    const items = await devDb.item.findMany({
      where: { userId: devUser.id, contentType: { not: 'FILE' } },
      include: { tags: true, collections: true, itemType: true },
    });

    const collections = await devDb.collection.findMany({ where: { userId: devUser.id } });
    const uniqueTags = [...new Map(items.flatMap(i => i.tags).map(t => [t.id, t])).values()];

    // Unique item types actually used by this user's items
    const usedTypes = [...new Map(items.map(i => [i.itemType.id, i.itemType])).values()];

    console.log(`  ${usedTypes.length} item types (via items)`);
    console.log(`  ${collections.length} collections`);
    console.log(`  ${items.length} items (files excluded)`);
    console.log(`  ${uniqueTags.length} tags`);

    // ── 2. Get or create demo user in prod ────────────────────────────────────

    let prodUser = await prodDb.user.findUnique({ where: { email: DEMO_EMAIL } });
    if (!prodUser) {
      prodUser = await prodDb.user.create({
        data: {
          email: devUser.email,
          name: devUser.name,
          password: devUser.password,
          emailVerified: devUser.emailVerified,
          isPro: devUser.isPro,
          editorPreferences: devUser.editorPreferences ?? undefined,
          createdAt: devUser.createdAt,
        },
      });
      console.log(`\nCreated demo user in prod (${prodUser.id})`);
    } else {
      console.log(`\nDemo user already in prod (${prodUser.id})`);
    }
    const prodUserId = prodUser.id;

    // ── 3. Build dev type name → prod type ID map ─────────────────────────────
    // Prod's seed already created item types for the prod demo user.
    // Match by name so we can assign the correct prod type IDs to items.

    const prodTypes = await prodDb.itemType.findMany({ where: { userId: prodUserId } });
    const typeNameToId = new Map(prodTypes.map(t => [t.name, t.id]));

    // Create any types missing from prod (shouldn't happen after seed, but safe)
    for (const devType of usedTypes) {
      if (!typeNameToId.has(devType.name)) {
        const created = await prodDb.itemType.create({
          data: {
            name: devType.name,
            icon: devType.icon,
            color: devType.color,
            isSystem: devType.isSystem,
            userId: prodUserId,
          },
        });
        typeNameToId.set(devType.name, created.id);
        console.log(`  Created missing item type: ${devType.name}`);
      }
    }
    console.log(`Item type map: ${[...typeNameToId.keys()].join(', ')}`);

    // ── 4. Wipe existing demo items and collections from prod ─────────────────

    console.log('\nClearing existing demo items and collections from prod...');
    await prodDb.item.deleteMany({ where: { userId: prodUserId } });
    await prodDb.collection.deleteMany({ where: { userId: prodUserId } });
    console.log('  Cleared');

    // ── 5. Collections ────────────────────────────────────────────────────────

    console.log('Inserting collections...');
    const colIdMap = new Map<string, string>();

    for (const col of collections) {
      const prodDefaultTypeId = col.defaultTypeId
        ? typeNameToId.get(usedTypes.find(t => t.id === col.defaultTypeId)?.name ?? '')
        : undefined;

      const created = await prodDb.collection.create({
        data: {
          name: col.name,
          description: col.description,
          isFavorite: col.isFavorite,
          userId: prodUserId,
          defaultTypeId: prodDefaultTypeId ?? null,
          createdAt: col.createdAt,
        },
      });
      colIdMap.set(col.id, created.id);
    }
    console.log(`  ${colIdMap.size} collections inserted`);

    // ── 6. Tags (global — upsert by name) ─────────────────────────────────────

    console.log('Upserting tags...');
    const tagIdMap = new Map<string, string>();
    for (const tag of uniqueTags) {
      const upserted = await prodDb.tag.upsert({
        where: { name: tag.name },
        update: {},
        create: { name: tag.name },
      });
      tagIdMap.set(tag.id, upserted.id);
    }
    console.log(`  ${tagIdMap.size} tags upserted`);

    // ── 7. Items ──────────────────────────────────────────────────────────────

    console.log('Inserting items...');
    let skipped = 0;
    let inserted = 0;

    for (const item of items) {
      const prodTypeId = typeNameToId.get(item.itemType.name);
      if (!prodTypeId) {
        console.warn(`  Skipping "${item.title}" — no matching type "${item.itemType.name}" in prod`);
        skipped++;
        continue;
      }

      await prodDb.item.create({
        data: {
          title: item.title,
          contentType: item.contentType,
          content: item.content,
          url: item.url,
          description: item.description,
          isFavorite: item.isFavorite,
          isPinned: item.isPinned,
          language: item.language,
          userId: prodUserId,
          itemTypeId: prodTypeId,
          createdAt: item.createdAt,
          tags: {
            connect: item.tags
              .map(t => ({ id: tagIdMap.get(t.id) }))
              .filter((t): t is { id: string } => !!t.id),
          },
          collections: {
            create: item.collections
              .map(ic => ({ collectionId: colIdMap.get(ic.collectionId)!, addedAt: ic.addedAt }))
              .filter(ic => !!ic.collectionId),
          },
        },
      });
      inserted++;
    }

    console.log(`  ${inserted} items inserted${skipped ? `, ${skipped} skipped` : ''}`);
    console.log('\nMigration complete.');
  } finally {
    await devDb.$disconnect();
    await prodDb.$disconnect();
  }
}

main().catch(err => {
  console.error('\nMigration failed:', err);
  process.exit(1);
});
