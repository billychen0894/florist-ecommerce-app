import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import { ProductReqPayload } from '@lib/types/api';
import { productsPayloadSchema } from '../productsPayloadValidation';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  try {
    const productId = req.url.slice(req.url.lastIndexOf('/') + 1);
    const body: ProductReqPayload = await req.json();
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
    } = body;

    try {
      await productsPayloadSchema.validate(body, {
        abortEarly: true,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error,
        },
        {
          status: 422,
        }
      );
    }

    const bearerToken = req.headers.get('authorization')?.split(' ')[1];

    if (!bearerToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    const validTokenPayload = verifyJwtAccessToken(bearerToken) as
      | JwtPayload
      | Error;

    if (validTokenPayload instanceof TokenExpiredError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Token Expired',
        },
        {
          status: 401,
        }
      );
    }

    if (validTokenPayload instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    if (validTokenPayload?.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: `Unauthorized: ${validTokenPayload?.role} role does not have access to this resource.`,
        },
        {
          status: 401,
        }
      );
    }

    // check if product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product does not exist.',
        },
        {
          status: 404,
        }
      );
    }

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

    return NextResponse.json(
      {
        success: true,
        message: 'Product updated successfully.',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error,
        message: 'Something went wrong while updating the product.',
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const productId = req.url.slice(req.url.lastIndexOf('/') + 1);

    const bearerToken = req.headers.get('authorization')?.split(' ')[1];

    if (!bearerToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    const validTokenPayload = verifyJwtAccessToken(bearerToken) as
      | JwtPayload
      | Error;

    if (validTokenPayload instanceof TokenExpiredError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Token Expired',
        },
        {
          status: 401,
        }
      );
    }

    if (validTokenPayload instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    if (validTokenPayload?.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: `Unauthorized: ${validTokenPayload?.role} role does not have access to this resource.`,
        },
        {
          status: 401,
        }
      );
    }

    // check if product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product does not exist.',
        },
        {
          status: 404,
        }
      );
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Product deleted successfully.',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error,
        message: 'Something went wrong while deleting the product.',
      },
      {
        status: 500,
      }
    );
  }
}
