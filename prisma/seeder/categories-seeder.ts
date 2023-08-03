import { Prisma, PrismaClient } from '@prisma/client';

const categoryData: Prisma.CategoryCreateInput[] = [
  {
    name: 'Bouquets',
  },
  {
    name: 'Plants',
  },
  {
    name: 'Gifts',
  },
  {
    name: 'Flowers',
  },
];

export async function seedCategories(prisma: PrismaClient): Promise<void> {
  try {
    // Seed Categories
    console.log('Seeding categories...');

    for (const category of categoryData) {
      const createdCategory = await prisma.category.create({
        data: category,
      });
      console.log(`Created category with id: ${createdCategory.id}`);
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}
