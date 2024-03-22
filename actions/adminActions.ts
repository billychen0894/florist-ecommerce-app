'use server';

import { options } from '@app/api/auth/[...nextauth]/options';
import { prisma } from '@lib/prisma';
import { getServerSession } from 'next-auth';
import { exclude } from '@lib/exclude';
import { ProductReqPayload } from '@lib/types/types';
import { productsPayloadSchema } from '@app/api/admin/products/productsPayloadValidation';
import { v4 as uuidv4 } from 'uuid';
import { OrderStatus } from '@prisma/client';

export const getAllUsers = async () => {
  try {
    const session = await getServerSession(options);
    if (!session) throw new Error('Unauthorized');
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    const users = await prisma.user.findMany({
      where: { role: 'user' },
    });

    if (users && users.length === 0) {
      return {
        success: true,
        data: [],
        message: 'No users found',
      };
    }

    const usersWithoutPassword = users.map((user) => {
      return exclude(user, ['password']);
    });

    return {
      success: true,
      data: usersWithoutPassword,
      message: 'All users',
    };
  } catch (error) {
    console.error('Error fetching all users', error);
    return null;
  }
};

export const deleteUserById = async (userId: string) => {
  try {
    if (!userId) throw new Error('User ID is required');
    const session = await getServerSession(options);
    if (!session) throw new Error('Unauthorized');
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    await prisma.user.delete({
      where: { id: userId },
    });

    return {
      success: true,
      message: 'User deleted',
    };
  } catch (error) {
    console.error('Error deleting user', error);
    return null;
  }
};

export const createProduct = async (data: ProductReqPayload) => {
  try {
    await productsPayloadSchema.validate(data, { abortEarly: true });
    const session = await getServerSession(options);
    if (!session) throw new Error('Unauthorized');
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    const {
      name,
      description,
      price,
      images,
      categories,
      units,
      inStock,
      leadTime,
      productDetail,
    } = data;

    const existingImages = images.existingImages.map((image) => {
      const publicId = image.slice(
        image.lastIndexOf('/') + 1,
        image.lastIndexOf('.')
      );
      return {
        url: image,
        publicId,
        name: `image-${publicId}`,
        alt: `image-${publicId}`,
      };
    });

    const newImages = images.newImages.map((image) => {
      if (image) {
        return {
          ...image,
          name: `image-${image.publicId}`,
          alt: `image-${image.publicId}`,
        };
      }
    });

    const updatedImages = [...existingImages, ...newImages] as {
      url: string;
      publicId: string;
      name: string;
      alt: string;
    }[];

    const updatedProductDetailItems = productDetail.productDetailItems.map(
      (item) => {
        const productItems = item.items.filter((i) => i !== '');
        return {
          ...item,
          items: productItems as string[],
        };
      }
    );

    await prisma.product.create({
      data: {
        name,
        description,
        price,
        images: {
          createMany: {
            data: updatedImages,
            skipDuplicates: true,
          },
        },
        categories: {
          connect: categories.map((category) => ({ name: category.name })),
        },
        units,
        inStock,
        leadTime,
        productDetail: {
          create: {
            productDetailItems: {
              createMany: {
                data: updatedProductDetailItems,
                skipDuplicates: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: 'Product created',
    };
  } catch (error) {
    console.error('Error creating product', error);
    return null;
  }
};

export const updateProductById = async (
  productId: string,
  data: ProductReqPayload
) => {
  try {
    if (!productId) throw new Error('Product ID is required');
    await productsPayloadSchema.validate(data, { abortEarly: true });

    const session = await getServerSession(options);
    if (!session) throw new Error('Unauthorized');
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    const {
      name,
      description,
      price,
      images,
      categories,
      units,
      inStock,
      leadTime,
      productDetail,
    } = data;

    const existingImages = images.existingImages.map((image) => {
      const partPublicId = image.slice(
        image.lastIndexOf('/') + 1,
        image.lastIndexOf('.')
      );
      const publicId = image?.startsWith('http')
        ? partPublicId
        : partPublicId + '-' + uuidv4();
      return {
        url: image,
        publicId,
        name: `image-${publicId}`,
        alt: `image-${publicId}`,
      };
    });

    const newImages = images.newImages.map((image) => {
      if (image) {
        return {
          url: image.url,
          publicId: image.publicId,
          name: `image-${image.publicId}`,
          alt: `image-${image.publicId}`,
        };
      }
    });

    const updatedImages = [...existingImages, ...newImages] as {
      url: string;
      publicId: string;
      name: string;
      alt: string;
    }[];

    const updatedProductDetailItems = productDetail.productDetailItems.map(
      (item) => {
        const productItems = item.items.filter((i) => i !== '');
        return {
          ...item,
          items: productItems as string[],
        };
      }
    );

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        description,
        price,
        images: {
          deleteMany: {},
          createMany: {
            data: updatedImages,
            skipDuplicates: true,
          },
        },
        categories: {
          set: [],
          connect: categories.map((category) => ({ name: category.name })),
        },
        units,
        inStock,
        leadTime,
        productDetail: {
          update: {
            productDetailItems: {
              deleteMany: {},
              createMany: {
                data: updatedProductDetailItems,
                skipDuplicates: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: 'Product updated',
    };
  } catch (error) {
    console.error('Error updating product', error);
    return null;
  }
};

export const deleteProductById = async (productId: string) => {
  try {
    if (!productId) throw new Error('Product ID is required');
    const session = await getServerSession(options);
    if (!session) throw new Error('Unauthorized');
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    await prisma.product.delete({
      where: { id: productId },
    });

    return {
      success: true,
      message: 'Product deleted',
    };
  } catch (error) {
    console.error('Error deleting product', error);
    return null;
  }
};

export const createCategory = async (name: string) => {
  try {
    if (!name) throw new Error('Category name is required');
    const session = await getServerSession(options);
    if (!session) throw new Error('Unauthorized');
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    const formattedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const existedCategory = await prisma.category.findUnique({
      where: {
        name: formattedName,
      },
    });

    if (existedCategory) {
      return {
        success: false,
        message: 'Category already exists',
      };
    }

    await prisma.category.create({
      data: {
        name: formattedName,
      },
    });

    return {
      success: true,
      message: 'Category created',
    };
  } catch (error) {
    console.error('Error creating category', error);
    return null;
  }
};

export const deleteCategoryById = async (categoryId: string) => {
  try {
    if (!categoryId) throw new Error('Category ID is required');
    const session = await getServerSession(options);
    if (!session) throw new Error('Unauthorized');
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return {
      success: true,
      message: 'Category deleted',
    };
  } catch (error) {
    console.error('Error deleting category', error);
    return null;
  }
};

export const getOrders = async () => {
  try {
    const session = await getServerSession(options);
    if (!session) throw new Error('Unauthorized');
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    const orders = await prisma.order.findMany({
      include: {
        shippingAddress: true,
        billingAddress: true,
        orderItems: true,
        user: true,
      },
    });

    if (orders && orders.length === 0) {
      return {
        success: true,
        data: [],
        message: 'No orders found',
      };
    }

    return {
      success: true,
      data: orders,
      message: 'All orders',
    };
  } catch (error) {
    console.error('Error fetching orders', error);
    return null;
  }
};

export const updateOrderByStripeId = async (
  orderId: string,
  data: { orderStatus: OrderStatus }
) => {
  try {
    if (!orderId) throw new Error('Order ID is required');
    if (!data || !data.orderStatus) throw new Error('Order status is required');
    const session = await getServerSession(options);
    if (!session) throw new Error('Unauthorized');
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    await prisma.order.update({
      where: {
        stripeInvoiceId: orderId,
      },
      data: {
        orderStatus: data.orderStatus,
      },
    });

    return {
      success: true,
      message: 'Order updated',
    };
  } catch (error) {
    console.error('Error updating order', error);
    return null;
  }
};
