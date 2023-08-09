import { signJwtAccessToken, signJwtRefreshToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import * as bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

interface RequestBody {
  email: string;
  password: string;
}

// POST: Sign in user with credentials
export async function POST(req: Request, res: Response) {
  try {
    const body: RequestBody = await req.json();
    const { email, password } = body;

    // Check if email and password are supplied
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: 'Please fill in all fields',
        },
        {
          status: 401,
        }
      );
    }

    // Check if email exists in db
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is not registered',
        },
        {
          status: 401,
        }
      );
    }

    // Check if user exists, and password is correct determined by bcrypt compare function as database stores hashed passwords
    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      // Return user object if password is correct
      const { password, ...userWithoutPassword } = user;

      // Create JWT Access Token
      const accessToken = signJwtAccessToken(userWithoutPassword);
      const refreshToken = signJwtRefreshToken(userWithoutPassword);

      return NextResponse.json(
        {
          success: true,
          ...userWithoutPassword,
          accessToken,
          refreshToken,
          message: 'User logged in successfully',
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials',
        },
        {
          status: 401,
        }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong',
      },
      {
        status: 500,
      }
    );
  }
}
