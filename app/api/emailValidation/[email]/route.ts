import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { email: string } }
) {
  const email = params.email;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return NextResponse.json(
      {
        status: 400,
        message: 'Please enter an email',
        error: 'ValidationError',
      },
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!emailRegex.test(email)) {
    return NextResponse.json(
      {
        status: 400,
        message: 'Please enter a valid email',
        error: 'ValidationError',
      },
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const userWithRegisteredEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithRegisteredEmail) {
    return NextResponse.json(
      {
        status: 400,
        message: 'Email already exists',
        error: 'ValidationError',
      },
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.json(
    {
      status: 200,
      message: 'Email is valid',
      error: null,
    },
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
