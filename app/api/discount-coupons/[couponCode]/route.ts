import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, res: Response) {
  try {
    const couponCode = req.url.slice(req.url.lastIndexOf('/') + 1);

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

    if (couponCode.length !== 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: 'Coupon code must be 10 characters long',
        },
        {
          status: 422,
        }
      );
    }

    const coupon = await prisma.discountCoupon.findUnique({
      where: {
        code: couponCode,
      },
    });

    if (!coupon) {
      return NextResponse.json(
        {
          success: false,
          error: 'NotFoundError',
          message: 'Coupon not found',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: coupon,
        message: 'Discount coupon fetched successfully',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
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
