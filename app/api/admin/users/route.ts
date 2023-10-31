import { exclude } from '@lib/exclude';
import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
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

    const users = await prisma.user.findMany({
      where: {
        role: 'user',
      },
    });

    if (users.length === 0) {
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

    const usersWithoutPassword = users.map((user) => {
      return exclude(user, ['password']);
    });

    return NextResponse.json(
      {
        success: true,
        data: usersWithoutPassword,
        message: 'Users found',
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
