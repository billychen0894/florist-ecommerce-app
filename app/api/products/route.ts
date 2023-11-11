import { prisma } from '@lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sort = searchParams.get('sort');
    const filters = searchParams.getAll('filter');
    const limit: number | undefined =
      searchParams.get('limit') === null
        ? undefined
        : Number(searchParams.get('limit'));
    const page =
      searchParams.get('page') === null ? 1 : Number(searchParams.get('page'));
    const keyword =
      searchParams.get('keyword') == null
        ? undefined
        : searchParams.get('keyword');
    const skip = limit === undefined ? 0 : (page - 1) * limit;
    const popular = sort === 'popular' ? 'desc' : 'asc';
    const newest = sort === 'newest' ? 'desc' : 'asc';
    const price = sort === 'price-high-to-low' ? 'desc' : 'asc';
    let queryFilters = {};

    if (filters && filters.length > 0 && !keyword) {
      queryFilters = {
        categories: {
          some: {
            name: {
              in: filters,
            },
          },
        },
      };
    } else if (filters && filters.length > 0 && keyword) {
      queryFilters = {
        categories: {
          some: {
            name: {
              in: filters,
            },
          },
        },
        name: {
          search: keyword,
        },
      };
    } else if (filters && filters.length === 0 && keyword) {
      queryFilters = {
        name: {
          search: keyword,
        },
      };
    }

    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        categories: true,
      },
      // include: {
      //   images: true,
      //   categories: true,
      //   orderItems: true,
      //   productDetail: {
      //     include: {
      //       productDetailItems: true,
      //     },
      //   },
      // },
      skip: skip,
      orderBy: [
        { price: price },
        {
          orderItems: {
            _count: popular,
          },
        },
        { createdAt: newest },
      ],
      take: limit,
      where: queryFilters,
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
