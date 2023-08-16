import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderBy = searchParams.get('orderBy') === 'desc' ? 'desc' : 'asc';
    const limit = Number(searchParams.get('limit')) || 12;

    const products = await prisma.product.findMany({
      include: {
        images: true,
        categories: true,
        orderItems: true,
      },
      take: limit,
      orderBy: {
        orderItems: {
          _count: orderBy,
        },
      },
    });

    if (products.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          message: 'No products found',
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: products,
        message: 'Products found',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: 'Something went wrong',
      },
      {
        status: 500,
      }
    );
  }
}
