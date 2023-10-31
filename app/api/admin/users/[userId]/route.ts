import { NextResponse } from '@node_modules/next/server';
import { verifyJwtAccessToken } from '@lib/jwt';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { prisma } from '@lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request) {
  try {
    const bearerToken = req.headers.get('authorization')?.split(' ')[1];
    const userId = req.url.slice(req.url.lastIndexOf('/') + 1);

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

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'UserId is required' },
        { status: 401 }
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'No users found',
        },
        {
          status: 404,
        }
      );
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'User deleted.',
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
