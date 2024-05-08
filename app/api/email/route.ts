import { JwtPayload } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { verifyJwtAccessToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

interface EmailPayload {
  email: string;
  emailVerified?: Date;
  emailVerifyToken: string | null;
}

export async function PUT(req: Request) {
  try {
    const body: EmailPayload = await req.json();
    const { email, emailVerified, emailVerifyToken } = body;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: 'Email is required',
        },
        {
          status: 422,
        }
      );
    }

    // Check if email exists in db
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'NotFoundError',
          message: 'User not found',
        },
        {
          status: 404,
        }
      );
    }

    let updatedUserData: EmailPayload;

    if (emailVerified) {
      updatedUserData = {
        email: existingUser.email as string,
        emailVerified: emailVerified,
        emailVerifyToken: null,
      };
    } else {
      if (!emailVerifyToken) {
        return NextResponse.json(
          {
            success: false,
            error: 'ValidationError',
            message: 'Email verify token is required',
          },
          {
            status: 422,
          }
        );
      }

      const emailTokenPayload = verifyJwtAccessToken(
        emailVerifyToken
      ) as JwtPayload;

      if (!emailTokenPayload) {
        return NextResponse.json(
          {
            success: false,
            error: 'UnauthorizedError',
            message: 'Invalid email verify token',
          },
          {
            status: 401,
          }
        );
      }
      const { email: emailFromPayload } = emailTokenPayload;

      if (emailFromPayload !== email) {
        return NextResponse.json(
          {
            success: false,
            error: 'ValidationError',
            message: 'Email does not match email in token',
          },
          {
            status: 422,
          }
        );
      }

      updatedUserData = {
        email: existingUser.email as string,
        emailVerified: existingUser.emailVerified as Date,
        emailVerifyToken: emailVerifyToken,
      };
    }

    // update user in database
    const user = await prisma.user.update({
      where: { email },
      data: {
        ...updatedUserData,
      },
    });

    const { password: userPassword, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        success: true,
        data: { ...userWithoutPassword },
        message: 'User updated successfully',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: 'Something went wrong',
      },
      {
        status: 500,
      }
    );
  }
}
