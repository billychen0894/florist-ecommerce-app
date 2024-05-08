import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { email: string } }
) {
  try {
    const email = params.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      return NextResponse.json(
        {
          message: 'Please enter an email',
          error: 'ValidationError',
        },
        { status: 422 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          message: 'Please enter a valid email',
          error: 'ValidationError',
        },
        { status: 422 }
      );
    }

    const userWithRegisteredEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithRegisteredEmail) {
      return NextResponse.json(
        {
          message: 'Email already exists',
          error: 'ConflictError',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: 'Email is valid',
        error: null,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Something went wrong',
        error: 'ServerError',
      },
      { status: 500 }
    );
  }
}
