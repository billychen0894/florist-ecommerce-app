'use server';

import { prisma } from '@lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProductById(productId: string) {
  try {
    if (!productId) throw new Error('Product ID is required');

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        categories: true,
        productDetail: {
          include: {
            productDetailItems: true,
          },
        },
      },
    });

    revalidatePath('(store)/products/[product]', 'page');
    return product;
  } catch (error) {
    console.error(error);
    return null;
  }
}
