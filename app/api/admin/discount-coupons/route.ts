import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import { DiscountCoupon, Prisma } from '@prisma/client';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

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
          message: 'Coupons are required',
        },
        {
          status: 422,
        }
      );
    }

    // check if all coupons are valid
    const invalidCoupons = coupons.filter((coupon) => {
      if (
        coupon.code.length === 0 ||
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
          message: `Some coupons already exist`,
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
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    const coupons = await prisma.discountCoupon.findMany();

    if (coupons.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          message: 'No discount coupons found',
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: coupons,
        message: 'Discount coupons fetched successfully',
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
        message: 'Something went wrong',
      },
      {
        status: 500,
      }
    );
  }
}
