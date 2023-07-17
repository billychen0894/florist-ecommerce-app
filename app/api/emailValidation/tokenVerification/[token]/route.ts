import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import { JwtPayload } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

interface Payload extends JwtPayload {
  email: string;
}

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  const token = params.token;

  // check if token exists
  if (!token) {
    return NextResponse.json(
      {
        status: 400,
        message: 'Token is required',
        error: 'ValidationError',
      },
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // check if token had expired 2 days after it was issued
  const decodedToken = verifyJwtAccessToken(token);
  const { email, exp } = decodedToken as Payload;
  const expiresAt = new Date(exp! * 1000);
  const isExpired = new Date() > expiresAt;

  if (isExpired) {
    return NextResponse.json(
      {
        status: 400,
        message: 'Token has expired',
        data: {
          emailVerifyToken: token,
          emailVerified: false,
          emailTokenExpired: true,
        },
        error: 'ValidationError',
      },
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const userWithRegisteredEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithRegisteredEmail?.emailVerified) {
    return NextResponse.json(
      {
        status: 400,
        message: 'Email is already verified',
        data: {
          emailVerifyToken: userWithRegisteredEmail.emailVerifyToken,
          emailVerified: true,
          emailTokenExpired: false,
        },
        error: 'ValidationError',
      },
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (userWithRegisteredEmail?.emailVerifyToken) {
    const decodedPayload = verifyJwtAccessToken(
      userWithRegisteredEmail.emailVerifyToken
    );

    if (decodedPayload?.email === email) {
      return NextResponse.json(
        {
          status: 200,
          message: 'Email is verified',
          data: {
            emailVerifyToken: userWithRegisteredEmail.emailVerifyToken,
            emailVerified: true,
            emailTokenExpired: false,
          },
          error: null,
        },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      return NextResponse.json(
        {
          status: 400,
          message: 'Email is not verified',
          data: {
            emailVerifyToken: userWithRegisteredEmail.emailVerifyToken,
            emailVerified: false,
            emailTokenExpired: false,
          },
          error: 'ValidationError',
        },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } else {
    return NextResponse.json(
      {
        status: 400,
        message: 'Email Verification Token is not found',
        data: {
          emailVerifyToken: userWithRegisteredEmail?.emailVerifyToken,
          emailVerified: false,
          emailTokenExpired: false,
        },
        error: 'ValidationError',
      },
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
