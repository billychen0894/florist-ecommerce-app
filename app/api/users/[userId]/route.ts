import { exclude } from '@lib/exclude';
import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import * as bcrypt from 'bcrypt';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Get user data
export async function GET(req: Request) {
  try {
    const userId = req.url.slice(req.url.lastIndexOf('/') + 1);

    const bearerToken = req.headers.get('authorization')?.split(' ')[1];

    if (!bearerToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    const validTokenPayload = verifyJwtAccessToken(bearerToken) as
      | JwtPayload
      | Error;

    if (validTokenPayload instanceof TokenExpiredError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Token Expired',
        },
        {
          status: 401,
        }
      );
    }

    if (validTokenPayload instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'ValidationError',
          message: 'User Id is required',
        },
        {
          status: 400,
        }
      );
    }

    if (
      validTokenPayload?.role === 'user' &&
      validTokenPayload?.id !== userId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Unauthorized: you are not allowed to access this user's data`,
        },
        {
          status: 401,
        }
      );
    }

    if (
      validTokenPayload?.role !== 'user' &&
      validTokenPayload?.role !== 'admin'
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Unauthorized: ${validTokenPayload?.role} is not allowed`,
        },
        {
          status: 401,
        }
      );
    }

    // Check if user exists in db
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'ValidationError',
          message: 'User not found',
        },
        {
          status: 400,
        }
      );
    }

    const userWithoutPassword = exclude(user, ['password']);

    return NextResponse.json(
      {
        success: true,
        data: userWithoutPassword,
        message: 'User found',
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

// Update user data
export async function PUT(req: Request) {
  try {
    const body: {
      name?: string;
      emailVerified?: Date;
      emailVerifyToken?: string;
      image?: string;
      phone?: string;
      cloudinaryPublicId?: string;
      password?: string;
      confirmPassword?: string;
      stripeCustomerId?: string;
    } = await req.json();
    const {
      name,
      emailVerified,
      emailVerifyToken,
      image,
      phone,
      password,
      confirmPassword,
      cloudinaryPublicId,
      stripeCustomerId,
    } = body;
    const userId = req.url.slice(req.url.lastIndexOf('/') + 1);

    const bearerToken = req.headers.get('authorization')?.split(' ')[1];

    if (!bearerToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    const validTokenPayload = verifyJwtAccessToken(bearerToken) as
      | JwtPayload
      | Error;

    if (validTokenPayload instanceof TokenExpiredError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Token Expired',
        },
        {
          status: 401,
        }
      );
    }

    if (validTokenPayload instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'ValidationError',
          message: 'User Id is required',
        },
        {
          status: 400,
        }
      );
    }

    if (
      validTokenPayload?.role === 'user' &&
      validTokenPayload?.id !== userId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Unauthorized: you are not allowed to update this user's data`,
        },
        {
          status: 401,
        }
      );
    }

    if (
      validTokenPayload?.role !== 'user' &&
      validTokenPayload?.role !== 'admin'
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Unauthorized: ${validTokenPayload?.role} is not allowed`,
        },
        {
          status: 401,
        }
      );
    }

    // Check if user exists in db
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'NotFoundError',
          message: 'User not found',
        },
        {
          status: 404,
        }
      );
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (password && !passwordRegex.test(password)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'ValidationError',
          message:
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number',
        },
        {
          status: 400,
        }
      );
    }

    if (password && confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'ValidationError',
          message: 'Passwords do not match',
        },
        {
          status: 400,
        }
      );
    }

    let hashedNewPassword: string | undefined;
    // hash password with bcrypt before storing in database
    if (password) {
      hashedNewPassword = await bcrypt.hash(password, 10);
    }

    const updatedUserData = {
      ...existingUser,
      name: name || existingUser.name,
      emailVerified: emailVerified || existingUser.emailVerified,
      emailVerifyToken: emailVerifyToken || existingUser.emailVerifyToken,
      phone: phone || existingUser.phone,
      image: image || existingUser.image,
      password: hashedNewPassword || existingUser.password,
      cloudinaryPublicId: cloudinaryPublicId || existingUser.cloudinaryPublicId,
      stripeCustomerId: stripeCustomerId || existingUser.stripeCustomerId,
    };

    // update user in database
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updatedUserData,
      },
    });

    const userWithoutPassword = exclude(user, ['password']);

    return NextResponse.json(
      {
        success: true,
        data: userWithoutPassword,
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
