import { PrismaClient } from '@prisma/client';
import { seedCategories } from './categories-seeder';
import { seedCreditCards } from './credit-cards-seeder';
import { seedOrders } from './orders-seeder';
import { seedProducts } from './products-seeder';
import { seedUsers } from './users-seeder';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log(`Start seeding ...`);

    await seedUsers(prisma);
    await seedProducts(prisma);
    await seedCategories(prisma);
    await seedCreditCards(prisma);
    await seedOrders(prisma);

    console.log(`Seeding finished.`);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Error in seed script:', error);
  process.exit(1);
});
