import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, res: Response) {
  const products = await prisma.product.findMany();

  if (!products) {
    return NextResponse.json(
      {
        success: true,
        data: [],
        message: 'No products found',
      },
      {
        status: 200,
      }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: products,
      message: 'Products found',
    },
    {
      status: 200,
    }
  );
}
