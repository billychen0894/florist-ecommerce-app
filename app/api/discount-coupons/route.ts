import { verifyJwtAccessToken } from '@lib/jwt';
import { DiscountCoupon, DiscountCouponFullInfo } from '@lib/types/api';
import { CouponStatus, Prisma } from '@prisma/client';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { prisma } from './../../../lib/prisma';

export async function POST(req: Request, res: Response) {
  try {
    const body: {
      coupons: DiscountCoupon[];
    } = await req.json();
    const { coupons } = body;

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
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    if (!coupons) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: 'Coupons are required',
        },
        {
          status: 422,
        }
      );
    }

    if (!Array.isArray(coupons)) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: 'Coupons must be an array',
        },
        {
          status: 422,
        }
      );
    }

    if (coupons.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: 'Coupons array must not be empty',
        },
        {
          status: 422,
        }
      );
    }

    // check if all coupons are valid
    const invalidCoupons = coupons.filter((coupon) => {
      if (
        coupon.code.length !== 10 ||
        coupon.description.length === 0 ||
        coupon.discount <= 0 ||
        coupon.discount >= 1 ||
        new Date(coupon.expiresAt) <= new Date() ||
        coupon.numberOfRedemptions <= 0
      ) {
        return true;
      }
      return false;
    });

    if (invalidCoupons.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: 'Invalid coupons',
        },
        {
          status: 422,
        }
      );
    }

    const existedCoupons = await Promise.all(
      coupons.map(
        async (coupon) =>
          await prisma.discountCoupon.findUnique({
            where: {
              code: coupon.code,
            },
          })
      )
    );

    if (existedCoupons.some((coupon) => coupon !== null)) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: `Coupons already exist`,
        },
        {
          status: 422,
        }
      );
    }

    const createdCoupons = await prisma.discountCoupon.createMany({
      data: coupons as Prisma.DiscountCouponCreateManyInput[],
      skipDuplicates: true,
    });

    if (!createdCoupons) {
      return NextResponse.json(
        {
          success: false,
          error: 'InternalServerError',
          message: 'Error while creating coupons',
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Coupons created successfully',
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error,
        message: 'Something went wrong',
      },
      {
        status: 500,
      }
    );
  }
}

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
