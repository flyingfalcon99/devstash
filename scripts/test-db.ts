import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  try {
    console.log('Testing database connection...');
    
    // Check connection by performing a simple query
    const itemTypes = await prisma.itemType.findMany();
    
    console.log('Successfully connected to the database!');
    console.log(`Found ${itemTypes.length} item types.`);
    
    if (itemTypes.length > 0) {
      console.log('Sample item types:', itemTypes.map((t) => t.name).join(', '));
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
