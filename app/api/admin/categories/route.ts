import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { verifyJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';

export async function POST(req: Request, res: Response) {
  try {
    const body: { name: string } = await req.json();
    const { name } = body;
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

    if (validTokenPayload?.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: `Unauthorized: ${validTokenPayload?.role} role does not have access to this resource.`,
        },
        {
          status: 401,
        }
      );
    }

    if (!name || name === '') {
      return NextResponse.json(
        {
          success: false,
          message: 'Name is required.',
        },
        {
          status: 422,
        }
      );
    }

    const formattedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    // check if category already exists
    const existedCategory = await prisma.category.findUnique({
      where: {
        name: formattedName,
      },
    });

    if (existedCategory) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category already exists.',
        },
        {
          status: 422,
        }
      );
    }

    await prisma.category.create({
      data: {
        name: formattedName,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Category created successfully.',
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        sucess: false,
        error: error,
        message: 'Something went wrong while creating the category.',
      },
      {
        status: 500,
      }
    );
  }
}
