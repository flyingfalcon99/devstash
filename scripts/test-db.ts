import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  try {
    console.log('Testing database connection...');
    
    // Check connection by performing a simple query
    const itemTypes = await prisma.itemType.findMany();
    const users = await prisma.user.findMany();
    const collections = await prisma.collection.findMany();
    const items = await prisma.item.findMany();
    
    console.log('Successfully connected to the database!');
    console.log(`Found ${itemTypes.length} system item types.`);
    console.log(`Found ${users.length} users.`);
    console.log(`Found ${collections.length} collections.`);
    console.log(`Found ${items.length} items.`);
    
    if (itemTypes.length > 0) {
      console.log('Sample item types:', itemTypes.map((t) => t.name).join(', '));
    }
    if (collections.length > 0) {
      console.log('Sample collections:', collections.map((c) => c.name).join(', '));
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
