import { prisma } from '@lib/prisma';
import * as bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

interface RequestBody {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

// POST: Create new user
export async function POST(req: Request, res: Response) {
  const body: RequestBody = await req.json();
  const { email, name, password, confirmPassword } = body;

  if (!email || !name || !password || !confirmPassword) {
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

  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({
      success: false,
      data: null,
      status: '401',
      error: 'ValidationError',
      message: 'Please enter a valid email address',
    });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({
      success: false,
      data: null,
      status: '401',
      error: 'ValidationError',
      message: 'Passwords do not match',
    });
  }

  if (password.length < 8) {
    return NextResponse.json({
      success: false,
      data: null,
      status: '401',
      error: 'ValidationError',
      message: 'Password must be at least 8 characters long',
    });
  }

  if (!/\d/.test(password)) {
    return NextResponse.json({
      success: false,
      data: null,
      status: '401',
      error: 'ValidationError',
      message: 'Password must contain at least one number',
    });
  }

  if (!/[a-z]/.test(password)) {
    return NextResponse.json({
      success: false,
      data: null,
      status: '401',
      error: 'ValidationError',
      message: 'Password must contain at least one lowercase letter',
    });
  }

  if (!/[A-Z]/.test(password)) {
    return NextResponse.json({
      success: false,
      data: null,
      status: '401',
      error: 'ValidationError',
      message: 'Password must contain at least one uppercase letter',
    });
  }

  // hash password with bcrypt before storing in database
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user in database
  const user = await prisma.user.create({
    data: {
      email,
      name,
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
