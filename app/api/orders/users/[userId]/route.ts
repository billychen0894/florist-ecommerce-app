import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';

export async function GET(req: Request, res: Response) {
  try {
    const userId = req.url.slice(req.url.lastIndexOf('/') + 1);

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

    if (validTokenPayload?.role !== 'user') {
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

    if (validTokenPayload?.id !== userId) {
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

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'ValidationError',
          message: 'User Id is required',
        },
        {
          status: 400,
        }
      );
    }

    // Check if user exists in db
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'NotFoundError',
          message: 'User not found',
        },
        {
          status: 404,
        }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        orderStatus: true,
        paymentMethod: true,
        shippingMethod: {
          select: {
            name: true,
            turnAround: true,
            location: true,
            location_operation_hours: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
        discountCoupon: true,
        createdAt: true,
        orderItems: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (orders.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          message: 'No orders found',
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: orders,
        message: 'Orders found',
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
        message: 'Something went wrong',
      },
      { status: 500 }
    );
  }
}
