import { prisma } from '@lib/prisma';
import { CouponStatus, Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

import { DiscountCouponCommonFields } from '@lib/types/api';

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

export async function PUT(req: Request, res: Response) {
  try {
    const body: DiscountCouponCommonFields = await req.json();
    const { description, discount, expiresAt, numberOfRedemptions, status } =
      body;

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

    if (description && description.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: 'Coupon description is required',
        },
        {
          status: 422,
        }
      );
    }

    if (discount && (discount <= 0 || discount >= 1)) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: 'Coupon discount must be between 0 and 1',
        },
        {
          status: 422,
        }
      );
    }

    if (expiresAt && new Date(expiresAt) <= new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: 'Coupon expiration date must be in the future',
        },
        {
          status: 422,
        }
      );
    }

    if (numberOfRedemptions && numberOfRedemptions < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: 'Coupon number of redemptions must be positive',
        },
        {
          status: 422,
        }
      );
    }

    if (
      status &&
      status !== CouponStatus.AVAILABLE &&
      status !== CouponStatus.EXPIRED &&
      status !== CouponStatus.UNAVAILABLE
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message:
            'Coupon status must be one of: AVAILABLE, EXPIRED, UNAVAILABLE',
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

    await prisma.discountCoupon.update({
      where: {
        code: couponCode,
      },
      data: {
        description: description || coupon.description,
        discount: discount || coupon.discount,
        expiresAt: expiresAt || coupon.expiresAt,
        numberOfRedemptions:
          numberOfRedemptions !== undefined
            ? numberOfRedemptions
            : coupon.numberOfRedemptions,
        status: (status as CouponStatus) || coupon.status,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Coupon updated successfully',
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
          message: 'Something went wrong while updating discount coupons.',
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
        message: 'Error while updating discount coupon',
      },
      {
        status: 500,
      }
    );
  }
}
