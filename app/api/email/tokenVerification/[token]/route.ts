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
  try {
    const token = params.token;

    // check if token exists
    if (!token) {
      return NextResponse.json(
        {
          message: 'Token is required',
          error: 'ValidationError',
        },
        { status: 422 }
      );
    }

    const decodedToken = verifyJwtAccessToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        {
          message: 'Invalid access token',
          data: {
            emailVerifyToken: token,
            emailVerified: false,
            emailTokenExpired: true,
          },
          error: 'UnauthorizedError',
        },
        { status: 401 }
      );
    }

    const { email, exp } = decodedToken as Payload;
    const expiresAt = new Date(exp! * 1000);
    const isExpired = new Date() > expiresAt;

    if (isExpired) {
      return NextResponse.json(
        {
          message: 'Token has expired',
          data: {
            email,
            emailVerifyToken: token,
            emailVerified: false,
            emailTokenExpired: true,
          },
          error: 'UnauthorizedError',
        },
        { status: 401 }
      );
    }

    const userWithRegisteredEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithRegisteredEmail?.emailVerified) {
      return NextResponse.json(
        {
          message: 'Email is already verified',
          data: {
            email,
            emailVerifyToken: userWithRegisteredEmail.emailVerifyToken,
            emailVerified: true,
            emailTokenExpired: false,
          },
          error: null,
        },
        { status: 409 }
      );
    }

    if (userWithRegisteredEmail?.emailVerifyToken) {
      const decodedPayload = verifyJwtAccessToken(
        userWithRegisteredEmail.emailVerifyToken
      ) as JwtPayload;

      if (
        decodedPayload?.email === email &&
        userWithRegisteredEmail?.emailVerifyToken === token
      ) {
        return NextResponse.json(
          {
            message: 'Email is successfully verified',
            data: {
              email,
              emailVerifyToken: userWithRegisteredEmail.emailVerifyToken,
              emailVerified: true,
              emailTokenExpired: false,
            },
            error: null,
          },
          {
            status: 200,
          }
        );
      } else {
        return NextResponse.json(
          {
            message: 'Email Verification Token is invalid',
            data: {
              email,
              emailVerifyToken: userWithRegisteredEmail.emailVerifyToken,
              emailVerified: false,
              emailTokenExpired: false,
            },
            error: 'UnauthorizedError',
          },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        {
          message: 'Email Verification Token is not found',
          data: {
            email,
            emailVerifyToken: userWithRegisteredEmail?.emailVerifyToken,
            emailVerified: false,
            emailTokenExpired: false,
          },
          error: 'NotFoundError',
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        error: 'InternalServerError',
      },
      { status: 500 }
    );
  }
}
