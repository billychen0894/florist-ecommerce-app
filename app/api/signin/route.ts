import { signJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import * as bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

interface RequestBody {
  email: string;
  password: string;
}

// POST: Sign in user
export async function POST(req: Request, res: Response) {
  const body: RequestBody = await req.json();
  const { email, password } = body;

  // Check if email and password are supplied
  if (!email || !password) {
    return NextResponse.json({
      success: false,
      data: null,
      status: '401',
      error: 'ValidationError',
      message: 'Please fill in all fields',
    });
  }

  // Check if email exists in db
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({
      success: false,
      data: null,
      status: '401',
      message: 'Email is not registered',
    });
  }

  // Check if user exists, and password is correct determined by bcrypt compare function as database stores hashed passwords
  if (user && (await bcrypt.compare(password, user.password))) {
    // Return user object if password is correct
    const { password, ...userWithoutPassword } = user;

    // Create JWT Access Token
    const accessToken = signJwtAccessToken(userWithoutPassword);

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      accessToken,
      status: '201',
      message: 'User logged in successfully',
    });
  } else {
    return NextResponse.json({
      success: false,
      data: null,
      status: '401',
      message: 'Invalid credentials',
    });
  }
}
