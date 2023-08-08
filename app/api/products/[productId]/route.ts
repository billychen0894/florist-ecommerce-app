import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, res: Response) {
  const productId = req.url.slice(req.url.lastIndexOf('/') + 1);

  if (!productId) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: 'No product id found',
      },
      {
        status: 400,
      }
    );
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return NextResponse.json(
      {
        success: true,
        data: null,
        message: `No product found with id ${productId}`,
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: product,
      message: `Product found with id ${productId}`,
    },
    {
      status: 200,
    }
  );
}
