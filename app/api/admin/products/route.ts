import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import { ProductReqPayload } from '@lib/types/api';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { productsPayloadSchema } from './productsPayloadValidation';

export async function POST(req: Request, res: Response) {
  try {
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

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully.',
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error,
        message: 'Something went wrong during product creation.',
      },
      {
        status: 500,
      }
    );
  }
}
