import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import { OrderFullInfo } from '@lib/types/api';
import { Prisma } from '@prisma/client';
import { ordersPayloadSchema } from './ordersPayloadValidation';

export async function DELETE(req: Request, res: Response) {
  try {
    const orderId = req.url.slice(req.url.lastIndexOf('/') + 1);
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

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Order ID is required',
        },
        {
          status: 422,
        }
      );
    }

    await prisma.order.delete({
      where: {
        id: orderId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Order deleted successfully.',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          success: false,
          error: error && error.meta && error.meta.cause,
          message: 'Something went wrong while deleting orders.',
        },
        {
          status: 404,
        }
      );
    }
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error,
        message: 'Something went wrong while deleting orders.',
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(req: Request, res: Response) {
  try {
    const body: OrderFullInfo = await req.json();
    const { contactEmail, contactPhone, orderStatus, shippingAddress } = body;
    const orderId = req.url.slice(req.url.lastIndexOf('/') + 1);
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

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Order ID is required',
        },
        {
          status: 422,
        }
      );
    }

    try {
      await ordersPayloadSchema.validate(body, {
        abortEarly: true,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error,
        },
        {
          status: 422,
        }
      );
    }

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        contactEmail,
        contactPhone,
        orderStatus,
        shippingAddress: {
          update: {
            addressLine1: shippingAddress.addressLine1,
            addressLine2: shippingAddress.addressLine2,
            company: shippingAddress.company,
            city: shippingAddress.city,
            stateOrProvince: shippingAddress.stateOrProvince,
            country: shippingAddress.country,
            postalCode: shippingAddress.postalCode,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Order updated successfully.',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          success: false,
          error: error && error.meta && error.meta.cause,
          message: 'Something went wrong while deleting orders.',
        },
        {
          status: 404,
        }
      );
    }
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error,
        message: 'Something went wrong while deleting orders.',
      },
      {
        status: 500,
      }
    );
  }
}
