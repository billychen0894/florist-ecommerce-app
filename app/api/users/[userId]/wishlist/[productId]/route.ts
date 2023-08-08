import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// Remove product from wishlist for user
export async function DELETE(req: Request, res: Response) {
  const userIdStart = req.url.lastIndexOf('/users/') + '/users/'.length;
  const userIdEnd = req.url.indexOf('/wishlist');
  const userId = req.url.slice(userIdStart, userIdEnd);
  const productId = req.url.slice(req.url.lastIndexOf('/') + 1);
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

  // Check if product exists in user wishlist

  const existingProductInWishlist = await prisma.product.findFirst({
    where: {
      id: productId,
    },
    select: {
      wishlist: {
        where: {
          id: userId,
        },
      },
    },
  });

  if (!existingProductInWishlist) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: 'NotFoundError',
        message: `Product ${productId} not found in wishlist for user ${userId}`,
      },
      {
        status: 404,
      }
    );
  }

  // Delete wished products from user wishlist
  const userWithUpdatedWishlist = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      wishlist: {
        delete: {
          id: productId,
        },
      },
    },
    include: {
      wishlist: true,
    },
  });

  return NextResponse.json(
    {
      success: true,
      data: null,
      message: `Product ${productId} removed from wishlist for user ${userId}`,
    },
    {
      status: 200,
    }
  );
}
