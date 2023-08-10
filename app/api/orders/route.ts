import { prisma } from '@lib/prisma';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { generateUniqueNumber } from '@lib/generateUniqueNumber';
import { getBillingValues } from '@lib/getBillingValue';
import { verifyJwtAccessToken } from '@lib/jwt';
import { OrderPayload } from '@lib/types/api';
import { AddressType, PaymentMethod } from '@prisma/client';
import {
  orderFormDataSchema,
  orderSummarySchema,
} from './ordersPayloadValidation';

export async function POST(req: Request, res: Response) {
  const body: OrderPayload = await req.json();
  const { formData, orderData } = body;
  const { userId, isGuestCheckout } = formData;

  // Validate order payload
  try {
    await orderFormDataSchema.validate(formData);
    await orderSummarySchema.validate(orderData);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error,
        message: 'Invalid order payload',
      },
      { status: 400 }
    );
  }

  if (isGuestCheckout) {
    try {
      const {
        billingAddressLine1,
        billingAddressLine2,
        billingCompany,
        billingCity,
        billingArea,
        billingCountry,
        billingPostalCode,
      } = getBillingValues(formData);

      await prisma.order.create({
        data: {
          guest: {
            connectOrCreate: {
              where: {
                email: formData.contactEmail,
              },
              create: {
                name: `${formData.shippingFirstName} ${formData.shippingLastName}`,
                email: formData.contactEmail,
              },
            },
          },
          orderNumber: generateUniqueNumber('BL'),
          contactEmail: formData.contactEmail,
          contactPhone: formData.shippingPhone,
          billingAddress: {
            connectOrCreate: {
              where: {
                postalCode: billingPostalCode,
              },
              create: {
                addressType: AddressType.BILLING,
                addressLine1: billingAddressLine1,
                addressLine2: billingAddressLine2,
                company: billingCompany,
                city: billingCity,
                stateOrProvince: billingArea,
                country: billingCountry,
                postalCode: billingPostalCode,
              },
            },
          },
          shippingAddress: {
            connectOrCreate: {
              where: {
                postalCode: formData.shippingPostalCode,
              },
              create: {
                addressType: AddressType.SHIPPING,
                addressLine1: formData.shippingAddressLine1,
                addressLine2: formData.shippingAddressLine2,
                company: formData.shippingCompany,
                city: formData.shippingCity,
                stateOrProvince: formData.shippingArea,
                country: formData.shippingCountry,
                postalCode: formData.shippingPostalCode,
              },
            },
          },
          paymentMethod:
            formData.paymentMethod === 'creditCard'
              ? PaymentMethod.CREDIT_CARD
              : PaymentMethod.PAYPAL,
          shippingMethod: {
            connect: {
              name: formData.deliveryMethod,
            },
          },
          total: orderData.total,
          orderItems: {
            createMany: {
              data: orderData.orderItems.map(
                (orderItem: { productId: string; quantity: number }) => ({
                  productId: orderItem.productId,
                  quantity: orderItem.quantity,
                })
              ),
            },
          },
          discountCoupon: {
            connect: {
              id: orderData?.discountCoupon?.id,
            },
          },
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Order created successfully',
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('error', error);
      return NextResponse.json(
        {
          success: false,
          error: error,
          message: 'Error creating order',
        },
        { status: 500 }
      );
    }
  } else {
    try {
      const {
        billingAddressLine1,
        billingAddressLine2,
        billingCompany,
        billingCity,
        billingArea,
        billingCountry,
        billingPostalCode,
      } = getBillingValues(formData);

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

      await prisma.order.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          orderNumber: generateUniqueNumber('BL'),
          contactEmail: formData.contactEmail,
          contactPhone: formData.shippingPhone,
          billingAddress: {
            connectOrCreate: {
              where: {
                postalCode: billingPostalCode,
              },
              create: {
                addressType: AddressType.BILLING,
                addressLine1: billingAddressLine1,
                addressLine2: billingAddressLine2,
                company: billingCompany,
                city: billingCity,
                stateOrProvince: billingArea,
                country: billingCountry,
                postalCode: billingPostalCode,
              },
            },
          },
          shippingAddress: {
            connectOrCreate: {
              where: {
                postalCode: formData.shippingPostalCode,
              },
              create: {
                addressType: AddressType.SHIPPING,
                addressLine1: formData.shippingAddressLine1,
                addressLine2: formData.shippingAddressLine2,
                company: formData.shippingCompany,
                city: formData.shippingCity,
                stateOrProvince: formData.shippingArea,
                country: formData.shippingCountry,
                postalCode: formData.shippingPostalCode,
              },
            },
          },
          paymentMethod:
            formData.paymentMethod === 'creditCard'
              ? PaymentMethod.CREDIT_CARD
              : PaymentMethod.PAYPAL,
          shippingMethod: {
            connect: {
              name: formData.deliveryMethod,
            },
          },
          total: orderData.total,
          orderItems: {
            createMany: {
              data: orderData.orderItems.map(
                (orderItem: { productId: string; quantity: number }) => ({
                  productId: orderItem.productId,
                  quantity: orderItem.quantity,
                })
              ),
            },
          },
          discountCoupon: {
            connect: {
              id: orderData?.discountCoupon?.id,
            },
          },
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Order created successfully',
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('error', error);
      return NextResponse.json(
        {
          success: false,
          error: error,
          message: 'Error creating order',
        },
        { status: 500 }
      );
    }
  }
}
