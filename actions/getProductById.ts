'use server';

import { prisma } from '@lib/prisma';

export async function getProductById(productId: string) {
  try {
    if (!productId) {
      return {
        success: false,
        data: null,
        message: 'Product id is required',
      };
    }

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

    if (!product) {
      return {
        success: true,
        data: null,
        message: `No product found with id ${productId}`,
      };
    }

    return {
      success: true,
      data: product,
      message: `Product found with id ${productId}`,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      message: 'Error fetching product by id',
    };
  }
}
