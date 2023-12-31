import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request) {
  try {
    const categoryId = req.url.slice(req.url.lastIndexOf('/') + 1);
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

    if (!categoryId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category ID is required.',
        },
        {
          status: 422,
        }
      );
    }

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Category deleted successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          success: false,
          error: error && error.meta && error.meta.cause,
          message: 'Something went wrong while deleting the category.',
        },
        {
          status: 500,
        }
      );
    }
    console.error(error);
    return NextResponse.json(
      {
        sucess: false,
        error: error,
        message: 'Something went wrong while updating the category.',
      },
      {
        status: 500,
      }
    );
  }
}
