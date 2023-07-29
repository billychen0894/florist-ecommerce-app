import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, res: Response) {
  const body: {
    email?: string;
    emailVerified?: Date;
    emailVerifyToken?: string;
  } = await req.json();
  const { email, emailVerified, emailVerifyToken } = body;

  if (!emailVerifyToken) {
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message: 'Email verify token is required',
    });
  }

  const emailTokenPayload = verifyJwtAccessToken(emailVerifyToken);

  if (!emailTokenPayload) {
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message: 'Invalid email verify token',
    });
  }
  const { email: emailFromPayload } = emailTokenPayload;

  if (!email) {
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message: 'Email is required',
    });
  }

  if (emailFromPayload !== email) {
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message: 'Email does not match email in token',
    });
  }

  // Check if email exists in db
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message: 'User not found',
    });
  }

  const updatedUserData = {
    email: existingUser.email,
    emailVerified: emailVerified || existingUser.emailVerified,
    emailVerifyToken: null,
  };

  // update user in database
  const user = await prisma.user.update({
    where: { email },
    data: {
      ...updatedUserData,
    },
  });

  const { password: userPassword, ...userWithoutPassword } = user;

  return NextResponse.json({
    success: true,
    data: { ...userWithoutPassword },
    status: 201,
    message: 'User updated successfully',
  });
}
