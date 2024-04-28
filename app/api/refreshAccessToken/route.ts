import { signJwtAccessToken, verifyJwtRefreshToken } from '@/lib/jwt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body: { refreshToken: string } = await req.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'Refresh Token is not supplied',
          error: 'UnauthorizedError',
        },
        {
          status: 400,
        }
      );
    }

    // verify refresh token
    const payload = verifyJwtRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: 'Refresh token is invalid',
          error: 'UnauthorizedError',
        },
        {
          status: 400,
        }
      );
    }

    if (payload.exp && Date.now() > payload.exp * 1000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Refresh Token has expired',
          error: 'UnauthorizedError',
        },
        {
          status: 400,
        }
      );
    }
    const { exp, iat, ...restPayload } = payload;
    const newAccessToken = signJwtAccessToken(restPayload);

    return NextResponse.json(
      {
        success: true,
        accessToken: newAccessToken,
        message: 'Access Token is refreshed successfully',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong',
        error: 'UnauthorizedError',
      },
      {
        status: 500,
      }
    );
  }
}
