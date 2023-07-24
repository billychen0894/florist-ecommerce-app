import {
  signJwtAccessToken,
  verifyJwtAccessToken,
  verifyJwtRefreshToken,
} from '@lib/jwt';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  const body: { refreshToken: string } = await req.json();
  const { refreshToken } = body;

  const bearerToken = req.headers.get('authorization')?.split(' ')[1];

  if (!bearerToken) {
    return NextResponse.json({
      success: false,
      status: 401,
      message: 'Unauthorized',
    });
  }

  const accessTokenPayload = verifyJwtAccessToken(bearerToken);
  if (!accessTokenPayload) {
    return NextResponse.json({
      success: false,
      status: 401,
      message: 'Unauthorized access token',
    });
  }

  if (!refreshToken) {
    return NextResponse.json({
      success: false,
      status: 401,
      message: 'Refresh Token is not supplied',
    });
  }

  // verify refresh token
  const payload = verifyJwtRefreshToken(refreshToken);

  if (!payload) {
    return NextResponse.json({
      success: false,
      status: 401,
      message: 'Something went wrong while verifying refresh token',
    });
  }

  if (payload.exp && Date.now() > payload.exp * 1000) {
    return NextResponse.json({
      success: false,
      status: 401,
      message: 'Refresh Token has expired',
    });
  }
  const { exp, iat, ...restPayload } = payload;
  const newAccessToken = signJwtAccessToken(restPayload);

  return NextResponse.json({
    success: true,
    status: 200,
    accessToken: newAccessToken,
    message: 'Access Token is refreshed successfully',
  });
}
