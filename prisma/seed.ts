import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Starting seed...');

  // 1. Create Demo User
  const hashedPassword = await bcrypt.hash('12345678', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@devstash.io' },
    update: {},
    create: {
      email: 'demo@devstash.io',
      name: 'Demo User',
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
  });
  console.log(`User created: ${user.email}`);

  // 2. Create System Item Types
  const systemItemTypes = [
    { name: 'snippet', icon: 'Code', color: '#3b82f6', isSystem: true },
    { name: 'prompt', icon: 'Sparkles', color: '#8b5cf6', isSystem: true },
    { name: 'command', icon: 'Terminal', color: '#f97316', isSystem: true },
    { name: 'note', icon: 'StickyNote', color: '#fde047', isSystem: true },
    { name: 'file', icon: 'File', color: '#6b7280', isSystem: true },
    { name: 'image', icon: 'Image', color: '#ec4899', isSystem: true },
    { name: 'link', icon: 'Link', color: '#10b981', isSystem: true },
  ];

  const itemTypes: Record<string, string> = {};
  for (const type of systemItemTypes) {
    let existing = await prisma.itemType.findFirst({
      where: { name: type.name, userId: null },
    });
    if (!existing) {
      existing = await prisma.itemType.create({ data: type });
    }
    itemTypes[type.name] = existing.id;
  }
  console.log('System item types seeded.');

  // Helper to create collection and items
  const createCollection = async (name: string, description: string, defaultTypeId: string) => {
    return await prisma.collection.create({
      data: {
        name,
        description,
        userId: user.id,
        defaultTypeId,
      },
    });
  };

  // 3. React Patterns
  const reactCollection = await createCollection(
    'React Patterns',
    'Reusable React patterns and hooks',
    itemTypes['snippet']
  );

  await Promise.all([
    prisma.item.create({
      data: {
        title: 'useLocalStorage Hook',
        contentType: 'TEXT',
        content: 'function useLocalStorage(key, initialValue) { ... }',
        description: 'A custom hook for localStorage.',
        language: 'typescript',
        userId: user.id,
        itemTypeId: itemTypes['snippet'],
        collections: { create: { collectionId: reactCollection.id } }
      }
    }),
    prisma.item.create({
      data: {
        title: 'useDebounce Hook',
        contentType: 'TEXT',
        content: 'function useDebounce(value, delay) { ... }',
        description: 'Debounce a rapidly changing value.',
        language: 'typescript',
        userId: user.id,
        itemTypeId: itemTypes['snippet'],
        collections: { create: { collectionId: reactCollection.id } }
      }
    }),
    prisma.item.create({
      data: {
        title: 'Compound Component Pattern',
        contentType: 'TEXT',
        content: 'const Tabs = ({ children }) => { ... }',
        description: 'Example of compound components in React.',
        language: 'typescript',
        userId: user.id,
        itemTypeId: itemTypes['snippet'],
        collections: { create: { collectionId: reactCollection.id } }
      }
    }),
  ]);

  // 4. AI Workflows
  const aiCollection = await createCollection(
    'AI Workflows',
    'AI prompts and workflow automations',
    itemTypes['prompt']
  );

  await Promise.all([
    prisma.item.create({
      data: {
        title: 'Code Review Prompt',
        contentType: 'TEXT',
        content: 'Please review this code for security vulnerabilities and performance issues: {code}',
        description: 'Comprehensive code review prompt.',
        userId: user.id,
        itemTypeId: itemTypes['prompt'],
        collections: { create: { collectionId: aiCollection.id } }
      }
    }),
    prisma.item.create({
      data: {
        title: 'Documentation Generator',
        contentType: 'TEXT',
        content: 'Generate JSDoc comments for the following functions...',
        description: 'Prompt to generate documentation.',
        userId: user.id,
        itemTypeId: itemTypes['prompt'],
        collections: { create: { collectionId: aiCollection.id } }
      }
    }),
    prisma.item.create({
      data: {
        title: 'Refactoring Assistant',
        contentType: 'TEXT',
        content: 'Refactor this code to use modern functional programming paradigms...',
        description: 'Help with refactoring legacy code.',
        userId: user.id,
        itemTypeId: itemTypes['prompt'],
        collections: { create: { collectionId: aiCollection.id } }
      }
    }),
  ]);

  // 5. DevOps
  const devopsCollection = await createCollection(
    'DevOps',
    'Infrastructure and deployment resources',
    itemTypes['command']
  );

  await Promise.all([
    prisma.item.create({
      data: {
        title: 'Docker Compose Local Setup',
        contentType: 'TEXT',
        content: 'version: "3.8"\nservices:\n  db:\n    image: postgres',
        description: 'Basic local Postgres setup.',
        language: 'yaml',
        userId: user.id,
        itemTypeId: itemTypes['snippet'],
        collections: { create: { collectionId: devopsCollection.id } }
      }
    }),
    prisma.item.create({
      data: {
        title: 'Deploy to Vercel',
        contentType: 'TEXT',
        content: 'vercel --prod',
        description: 'Deploy project to Vercel production.',
        language: 'bash',
        userId: user.id,
        itemTypeId: itemTypes['command'],
        collections: { create: { collectionId: devopsCollection.id } }
      }
    }),
    prisma.item.create({
      data: {
        title: 'Docker Docs',
        contentType: 'URL',
        url: 'https://docs.docker.com/',
        description: 'Official Docker Documentation',
        userId: user.id,
        itemTypeId: itemTypes['link'],
        collections: { create: { collectionId: devopsCollection.id } }
      }
    }),
    prisma.item.create({
      data: {
        title: 'Vercel Docs',
        contentType: 'URL',
        url: 'https://vercel.com/docs',
        description: 'Official Vercel Documentation',
        userId: user.id,
        itemTypeId: itemTypes['link'],
        collections: { create: { collectionId: devopsCollection.id } }
      }
    }),
  ]);

  // 6. Terminal Commands
  const terminalCollection = await createCollection(
    'Terminal Commands',
    'Useful shell commands for everyday development',
    itemTypes['command']
  );

  await Promise.all([
    prisma.item.create({
      data: {
        title: 'Git Undo Last Commit',
        contentType: 'TEXT',
        content: 'git reset --soft HEAD~1',
        description: 'Undo the last commit while keeping changes staged.',
        language: 'bash',
        userId: user.id,
        itemTypeId: itemTypes['command'],
        collections: { create: { collectionId: terminalCollection.id } }
      }
    }),
    prisma.item.create({
      data: {
        title: 'Docker Remove All Containers',
        contentType: 'TEXT',
        content: 'docker rm -f $(docker ps -aq)',
        description: 'Force remove all Docker containers.',
        language: 'bash',
        userId: user.id,
        itemTypeId: itemTypes['command'],
        collections: { create: { collectionId: terminalCollection.id } }
      }
    }),
    prisma.item.create({
      data: {
        title: 'Kill Port',
        contentType: 'TEXT',
        content: 'npx kill-port 3000',
        description: 'Kill process running on port 3000.',
        language: 'bash',
        userId: user.id,
        itemTypeId: itemTypes['command'],
        collections: { create: { collectionId: terminalCollection.id } }
      }
    }),
    prisma.item.create({
      data: {
        title: 'NPM Update All',
        contentType: 'TEXT',
        content: 'npx npm-check-updates -u && npm install',
        description: 'Update all packages to latest versions.',
        language: 'bash',
        userId: user.id,
        itemTypeId: itemTypes['command'],
        collections: { create: { collectionId: terminalCollection.id } }
      }
    }),
  ]);

  // 7. Design Resources
  const designCollection = await createCollection(
    'Design Resources',
    'UI/UX resources and references',
    itemTypes['link']
  );

  await Promise.all([
    prisma.item.create({
      data: {
        title: 'Tailwind CSS Docs',
        contentType: 'URL',
        url: 'https://tailwindcss.com/docs',
        description: 'Official Tailwind CSS documentation.',
        userId: user.id,
        itemTypeId: itemTypes['link'],
        collections: { create: { collectionId: designCollection.id } }
      }
    }),
    prisma.item.create({
      data: {
        title: 'shadcn/ui',
        contentType: 'URL',
        url: 'https://ui.shadcn.com/',
        description: 'Beautifully designed components.',
        userId: user.id,
        itemTypeId: itemTypes['link'],
        collections: { create: { collectionId: designCollection.id } }
      }
    }),
    prisma.item.create({
      data: {
        title: 'Lucide Icons',
        contentType: 'URL',
        url: 'https://lucide.dev/',
        description: 'Beautiful & consistent icons.',
        userId: user.id,
        itemTypeId: itemTypes['link'],
        collections: { create: { collectionId: designCollection.id } }
      }
    }),
    prisma.item.create({
      data: {
        title: 'Figma',
        contentType: 'URL',
        url: 'https://figma.com/',
        description: 'Collaborative interface design tool.',
        userId: user.id,
        itemTypeId: itemTypes['link'],
        collections: { create: { collectionId: designCollection.id } }
      }
    }),
  ]);

  console.log('Seed data successfully generated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
