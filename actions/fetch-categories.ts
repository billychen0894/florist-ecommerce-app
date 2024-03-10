'use server';

import { prisma } from '@lib/prisma';

export async function fetchCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return categories;
  } catch (error) {
    console.error(error);
    return null;
  }
}
