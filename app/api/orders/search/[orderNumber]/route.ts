import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, res: Response) {
  try {
    const orderNumber = req.url.slice(req.url.lastIndexOf('/') + 1);

    if (!orderNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: 'Order number is required',
        },
        {
          status: 422,
        }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        orderNumber: orderNumber,
      },
      select: {
        id: true,
        orderNumber: true,
        contactEmail: true,
        contactPhone: true,
        total: true,
        orderStatus: true,
        paymentMethod: true,
        createdAt: true,
        shippingMethod: {
          select: {
            name: true,
            turnAround: true,
            location: true,
            location_operation_hours: true,
          },
        },
        shippingAddress: {
          select: {
            addressLine1: true,
            addressLine2: true,
            company: true,
            city: true,
            stateOrProvince: true,
            postalCode: true,
            country: true,
          },
        },
        billingAddress: {
          select: {
            addressLine1: true,
            addressLine2: true,
            company: true,
            city: true,
            stateOrProvince: true,
            postalCode: true,
            country: true,
          },
        },
        orderItems: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'NotFoundError',
          message: 'Order not found',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: order,
        message: 'Order found',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error,
        message: 'Server error',
      },
      {
        status: 500,
      }
    );
  }
}
