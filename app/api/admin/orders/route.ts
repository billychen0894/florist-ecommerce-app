import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';

export async function GET(req: Request, res: Response) {
  try {
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

    const orders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        stripeInvoiceId: true,
        invoiceUrl: true,
        contactEmail: true,
        contactPhone: true,
        total: true,
        orderStatus: true,
        paymentStatus: true,
        shippingAddress: {
          select: {
            addressLine1: true,
            addressLine2: true,
            company: true,
            city: true,
            stateOrProvince: true,
            postalCode: true,
            country: true,
          },
        },
        billingAddress: {
          select: {
            addressLine1: true,
            addressLine2: true,
            company: true,
            city: true,
            stateOrProvince: true,
            postalCode: true,
            country: true,
          },
        },
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
        userId: true,
      },
    });

    if (orders.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          message: 'Currently no orders to retrieve.',
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
        message: 'Successfully retrieved orders.',
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
        message: 'Something went wrong while retrieving orders.',
      },
      {
        status: 500,
      }
    );
  }
}
