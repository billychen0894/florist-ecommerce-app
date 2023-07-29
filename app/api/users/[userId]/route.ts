import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';

// Update user data
export async function PUT(req: Request, res: Response) {
  const body: {
    name?: string;
    email?: string;
    emailVerified?: Date;
    emailVerifyToken?: string;
    image?: string;
    password?: string;
  } = await req.json();
  const { name, email, emailVerified, emailVerifyToken, image, password } =
    body;
  const userId = req.url.slice(req.url.lastIndexOf('/') + 1);

  if (!userId) {
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message: 'User Id is required',
    });
  }

  if (!email) {
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message: 'Email is required',
    });
  }

  // Check if email exists in db
  const existedEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (!existedEmail) {
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message: 'User not found',
    });
  }

  const updatedUserData = {
    name: name || existedEmail.name,
    email: existedEmail.email,
    emailVerified: emailVerified || existedEmail.emailVerified,
    emailVerifyToken: emailVerifyToken || existedEmail.emailVerifyToken,
    image: image || existedEmail.image,
    password: password || existedEmail.password,
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
