import { prisma } from '@lib/prisma';
import * as bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

import type { SignUpFormData } from '@components/Auth/SignUpForm';

// TODO: Check Why the endpoint always returns 200
// POST: Create new user
export async function POST(req: Request, res: Response) {
  const body: SignUpFormData = await req.json();
  const { email, password, confirmPassword, firstName, lastName } = body;

  // Validate form data
  if (
    email === '' ||
    password === '' ||
    confirmPassword === '' ||
    firstName === '' ||
    lastName === ''
  ) {
    return NextResponse.json({
      success: false,
      data: null,
      status: '401',
      error: 'ValidationError',
      message: 'Please fill in all fields',
    });
  }

  // Check if email exists in db
  const existedEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existedEmail) {
    return NextResponse.json({
      success: false,
      data: null,
      status: '401',
      error: 'ValidationError',
      message: 'Email already exists',
    });
  }

  // Check email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({
      success: false,
      data: null,
      status: '401',
      error: 'ValidationError',
      message: 'Please enter a valid email',
    });
  }

  if (firstName.length > 50 || lastName.length > 50) {
    return NextResponse.json({
      success: false,
      data: null,
      status: '401',
      error: 'ValidationError',
      message: 'First and last name must be less than 50 characters',
    });
  }

  // Check password is valid
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return NextResponse.json({
      success: false,
      data: null,
      status: '401',
      error: 'ValidationError',
      message:
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number',
    });
  }

  // Check passwords match
  if (password !== confirmPassword) {
    return NextResponse.json({
      success: false,
      data: null,
      status: '401',
      error: 'ValidationError',
      message: 'Passwords do not match',
    });
  }

  // hash password with bcrypt before storing in database
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user in database
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });

  // return user object if password is correct but do not expose password
  const { password: userPassword, ...userWithoutPassword } = user;

  return NextResponse.json({
    success: true,
    data: { ...userWithoutPassword },
    status: '201',
    message: 'User created successfully',
  });
}
