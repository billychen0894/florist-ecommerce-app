import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import { ProductPayload } from '@lib/types/api';
import { productsPayloadSchema } from '../productsPayloadValidation';

export async function PUT(req: Request, res: Response) {
  try {
    const productId = req.url.slice(req.url.lastIndexOf('/') + 1);
    const body: ProductPayload = await req.json();
    const {
      name,
      description,
      price,
      images,
      inStock,
      leadTime,
      categories,
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

    const updatedProduct = await prisma.product.update({
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
            data: images,
            skipDuplicates: true,
          },
        },
        inStock,
        leadTime,
        categories: {
          set: [],
          connect: categories.map((category) => ({ name: category.name })),
        },
        productDetail: {
          update: {
            productDetailItems: {
              deleteMany: {},
              createMany: {
                data: productDetail.productDetailItems,
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
