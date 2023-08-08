import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';

//Get related products based on keyword parameter
export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: 'No keyword found',
      },
      {
        status: 400,
      }
    );
  }

  const products = await prisma.product.findMany({
    include: {
      categories: {
        select: {
          name: true,
        },
      },
    },
    where: {
      name: {
        search: keyword,
      },
      description: {
        search: keyword,
      },
      categories: {
        some: {
          name: {
            search: keyword,
          },
        },
      },
    },
    orderBy: {
      _relevance: {
        fields: ['name', 'description'],
        search: keyword,
        sort: 'asc',
      },
    },
  });

  return NextResponse.json(
    {
      success: true,
      data: products,
      message: `Products found with keyword ${keyword}`,
    },
    {
      status: 200,
    }
  );
}
