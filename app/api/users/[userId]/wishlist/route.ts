import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// Add product to wishlist for user
export async function POST(req: Request, res: Response) {
  const body: {
    productId: string;
  } = await req.json();
  const userIdStart = req.url.lastIndexOf('/users/') + '/users/'.length;
  const userIdEnd = req.url.indexOf('/wishlist');
  const userId = req.url.slice(userIdStart, userIdEnd);
  const bearerToken = req.headers.get('authorization')?.split(' ')[1];
  const { productId } = body;

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

  if (validTokenPayload?.role !== 'user') {
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

  if (validTokenPayload?.id !== userId) {
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

  if (!userId && !productId) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: 'ValidationError',
        message: 'Both userId and productId are required',
      },
      {
        status: 400,
      }
    );
  }

  // Check if user exists in db
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  // Check if product exists in db
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
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

  if (!existingProduct) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: 'NotFoundError',
        message: 'Product not found',
      },
      {
        status: 404,
      }
    );
  }

  // Check if product is already in user wishlist
  const existingWishlistItem = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      wishlist: {
        where: {
          id: productId,
        },
      },
    },
  });

  if (existingWishlistItem?.wishlist.length) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: 'ValidationError',
        message: 'Product already in wishlist',
      },
      {
        status: 400,
      }
    );
  }

  // Add product to user wishlist
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      wishlist: {
        connect: {
          id: productId,
        },
      },
    },
  });

  return NextResponse.json(
    {
      success: true,
      data: existingProduct,
      message: 'Product added to wishlist',
    },
    {
      status: 200,
    }
  );
}
