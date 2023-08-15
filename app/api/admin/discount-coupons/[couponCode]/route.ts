import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import { Prisma } from '@prisma/client';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, res: Response) {
  try {
    const couponCode = req.url.slice(req.url.lastIndexOf('/') + 1);
    const bearerToken = req.headers.get('authorization')?.split(' ')[1];

    if (!couponCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: 'Coupon code is required',
        },
        {
          status: 422,
        }
      );
    }

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
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    await prisma.discountCoupon.delete({
      where: {
        code: couponCode,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Discount coupon deleted successfully',
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
          message: 'Something went wrong while deleting discount coupons.',
        },
        {
          status: 500,
        }
      );
    }
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error,
        message: 'Error while fetching discount coupon',
      },
      {
        status: 500,
      }
    );
  }
}
