import { prisma } from '@lib/prisma';
import { Filter, Sort } from '@lib/types/api';
import { NextResponse } from 'next/server';

// Get related products based on filter & sort query parameter
export async function GET(req: Request, res: Response) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = searchParams.getAll('filter') as Filter[];
    const sort = searchParams.get('sort') as Sort | null;

    if (!filters && !sort) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: 'No filter and sort applied',
        },
        {
          status: 400,
        }
      );
    }

    let products;

    if (filters.length > 0) {
      products = await prisma.product.findMany({
        where: {
          categories: {
            some: {
              name: {
                in: filters,
              },
            },
          },
        },
        include: {
          categories: {
            select: {
              name: true,
            },
          },
        },
      });
    }

    switch (sort) {
      case 'Popular':
        products = await prisma.product.findMany({
          orderBy: {
            orderItems: {
              _count: 'desc',
            },
          },
          include: {
            _count: {
              select: {
                orderItems: true,
              },
            },
          },
        });
        break;
      case 'Newest':
        products = await prisma.product.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });
        break;
      case 'Price-low-to-high':
        products = await prisma.product.findMany({
          orderBy: {
            price: 'asc',
          },
        });
        break;
      case 'Price-high-to-low':
        products = await prisma.product.findMany({
          orderBy: {
            price: 'desc',
          },
        });
        break;
    }

    if (filters.length > 0 && sort) {
      switch (sort) {
        case 'Popular':
          products = await prisma.product.findMany({
            where: {
              categories: {
                some: {
                  name: {
                    in: filters,
                  },
                },
              },
            },
            orderBy: {
              orderItems: {
                _count: 'desc',
              },
            },
            include: {
              _count: {
                select: {
                  orderItems: true,
                },
              },
              categories: {
                select: {
                  name: true,
                },
              },
            },
          });
          break;
        case 'Newest':
          products = await prisma.product.findMany({
            where: {
              categories: {
                some: {
                  name: {
                    in: filters,
                  },
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              categories: {
                select: {
                  name: true,
                },
              },
            },
          });
          break;
        case 'Price-low-to-high':
          products = await prisma.product.findMany({
            where: {
              categories: {
                some: {
                  name: {
                    in: filters,
                  },
                },
              },
            },
            orderBy: {
              price: 'asc',
            },
            include: {
              categories: {
                select: {
                  name: true,
                },
              },
            },
          });
          break;
        case 'Price-high-to-low':
          products = await prisma.product.findMany({
            where: {
              categories: {
                some: {
                  name: {
                    in: filters,
                  },
                },
              },
            },
            orderBy: {
              price: 'desc',
            },
            include: {
              categories: {
                select: {
                  name: true,
                },
              },
            },
          });
          break;
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: products,
        message: 'Products found with filter and sort',
      },
      {
        status: 200,
      }
    );
  } catch {
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
