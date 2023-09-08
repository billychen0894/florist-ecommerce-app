import { generateUniqueNumber } from '@lib/generateUniqueNumber';
import { prisma } from '@lib/prisma';
import { stripe } from '@lib/stripe';
import { TCartItem } from '@lib/types/api';
import { PaymentMethod } from '@prisma/client';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request, res: Response) {
  const body: { orders: TCartItem[] } = await req.json();
  const { orders } = body;

  if (Object.keys(orders).length === 0 || !orders) {
    return NextResponse.json(
      {
        success: false,
        message: 'Cart items are emptied',
      },
      {
        status: 400,
      }
    );
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  orders.forEach((orderItem) => {
    lineItems.push({
      quantity: orderItem.quantity,
      price_data: {
        currency: 'CAD',
        product_data: {
          name: orderItem.product.name,
          images: orderItem.product.images.map(
            (image) => `${process.env.APP_BASE_URL}${image.url}`
          ),
        },
        unit_amount: orderItem.product.price * 100,
      },
    });
  });

  const order = await prisma.order.create({
    data: {
      orderNumber: generateUniqueNumber('BL'),
      paymentMethod: PaymentMethod.CREDIT_CARD,
      total: orders.reduce((acc, orderItem) => {
        return (acc += orderItem.quantity * orderItem.product.price);
      }, 0),
      orderItems: {
        createMany: {
          data: orders.map((orderItem) => ({
            productId: orderItem.product.id,
            quantity: orderItem.quantity,
          })),
        },
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    submit_type: 'pay',
    mode: 'payment',
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    shipping_address_collection: {
      allowed_countries: ['CA'],
    },
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.APP_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_BASE_URL}/cart`,
    metadata: {
      orderId: order.id,
    },
    automatic_tax: {
      enabled: true,
    },
    allow_promotion_codes: true,
    currency: 'CAD',
    shipping_options: [
      {
        shipping_rate: 'shr_1NnvQ6I68Lgv4LlQsErbx9n7',
      },
    ],
    invoice_creation: {
      enabled: true,
    },
  });

  return NextResponse.json({ url: session.url });
}
