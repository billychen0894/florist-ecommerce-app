import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// Get user data
export async function GET(req: Request, res: Response) {
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
        headers: {
          'Content-Type': 'application/json',
        },
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
        headers: {
          'Content-Type': 'application/json',
        },
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
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  if (validTokenPayload?.id !== userId) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized',
      },
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
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
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
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
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  const { password: userPassword, ...userWithoutPassword } = user;

  return NextResponse.json(
    {
      success: true,
      data: { ...userWithoutPassword },
      message: 'User found',
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// Update user data
export async function PUT(req: Request, res: Response) {
  const body: {
    name?: string;
    emailVerified?: Date;
    emailVerifyToken?: string;
    image?: string;
    password?: string;
  } = await req.json();
  const { name, emailVerified, emailVerifyToken, image, password } = body;
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
        headers: {
          'Content-Type': 'application/json',
        },
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
        headers: {
          'Content-Type': 'application/json',
        },
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
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  if (validTokenPayload?.id !== userId) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized',
      },
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
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
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
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
        error: 'ValidationError',
        message: 'User not found',
      },
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  const updatedUserData = {
    ...existingUser,
    name: name || existingUser.name,
    emailVerified: emailVerified || existingUser.emailVerified,
    emailVerifyToken: emailVerifyToken || existingUser.emailVerifyToken,
    image: image || existingUser.image,
    password: password || existingUser.password,
  };

  // update user in database
  const user = await prisma.user.update({
    where: { id: userId },
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
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
