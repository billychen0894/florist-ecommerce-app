import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sortByOrderItemsCount =
      searchParams.get('sortByOrderItems') === 'desc' ? 'desc' : 'asc';
    const limit: number | undefined =
      searchParams.get('limit') === null
        ? undefined
        : Number(searchParams.get('limit'));
    const page =
      searchParams.get('page') === null ? 1 : Number(searchParams.get('page'));
    const skip = limit === undefined ? 0 : (page - 1) * limit;

    const products = await prisma.product.findMany({
      include: {
        images: true,
        categories: true,
        orderItems: true,
      },
      skip: skip,
      orderBy: {
        orderItems: {
          _count: sortByOrderItemsCount,
        },
      },
      take: limit,
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
