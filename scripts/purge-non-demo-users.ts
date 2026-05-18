import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

const DEMO_EMAIL = 'demo@devstash.io';

async function main() {
  const demo = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (!demo) {
    console.error(`Demo user (${DEMO_EMAIL}) not found — aborting.`);
    process.exit(1);
  }

  const targets = await prisma.user.findMany({
    where: { email: { not: DEMO_EMAIL } },
    select: { id: true, email: true },
  });

  if (targets.length === 0) {
    console.log('No non-demo users found. Nothing to delete.');
    return;
  }

  console.log(`Found ${targets.length} user(s) to delete:`);
  targets.forEach((u) => console.log(`  - ${u.email}`));

  const emails = targets.map((u) => u.email).filter(Boolean) as string[];
  const ids = targets.map((u) => u.id);

  // Delete verification tokens by email (not user-id-linked)
  const { count: tokenCount } = await prisma.verificationToken.deleteMany({
    where: { identifier: { in: emails } },
  });

  // Delete users — cascades: Accounts, Sessions, Items → ItemCollections, Collections, ItemTypes
  const { count: userCount } = await prisma.user.deleteMany({
    where: { id: { in: ids } },
  });

  // Clean up tags that no longer reference any items
  const orphanedTags = await prisma.tag.findMany({
    where: { items: { none: {} } },
    select: { id: true },
  });
  const { count: tagCount } = await prisma.tag.deleteMany({
    where: { id: { in: orphanedTags.map((t) => t.id) } },
  });

  console.log('\nDone:');
  console.log(`  ${userCount} user(s) deleted (+ cascaded accounts, sessions, items, collections)`);
  console.log(`  ${tokenCount} verification token(s) deleted`);
  console.log(`  ${tagCount} orphaned tag(s) deleted`);
}

main()
  .catch((err) => {
    console.error('Script failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
