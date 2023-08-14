import { prisma } from '@lib/prisma';
import { CouponStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

import { DiscountCouponFullInfo } from '@lib/types/api';

export async function PUT(req: Request, res: Response) {
  try {
    const body: DiscountCouponFullInfo = await req.json();
    const {
      code,
      description,
      discount,
      expiresAt,
      numberOfRedemptions,
      status,
    } = body;

    if (code && code.length !== 10) {
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
        code: code,
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

    const updatedCoupon = await prisma.discountCoupon.update({
      where: {
        code: code,
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

    if (!updatedCoupon) {
      return NextResponse.json(
        {
          success: false,
          error: 'InternalServerError',
          message: 'Error while updating discount coupon',
        },
        {
          status: 500,
        }
      );
    }

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
