import { signJwtAccessToken, verifyJwtRefreshToken } from '@lib/jwt';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  const body: { refreshToken: string } = await req.json();
  const { refreshToken } = body;

  if (!refreshToken) {
    return NextResponse.json(
      {
        success: false,
        message: 'Refresh Token is not supplied',
      },
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
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
      },
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  if (payload.exp && Date.now() > payload.exp * 1000) {
    return NextResponse.json(
      {
        success: false,
        message: 'Refresh Token has expired',
      },
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
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
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
