import { prisma } from '@lib/prisma';
import { stripe } from '@lib/stripe';
import { TCartItem } from '@lib/types/api';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body: {
    orders: TCartItem[];
    userId?: string;
    userAssociatedStripeId?: string;
  } = await req.json();
  const { orders, userId } = body;

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
          images: orderItem.product.images.map((image) => {
            if (image.url.startsWith('http')) {
              // if it's public url path
              return image.url;
            } else {
              // if it's local file path
              return `${process.env.APP_BASE_URL}${image.url}`;
            }
          }) as string[],
          metadata: {
            productId: orderItem.product.id,
          },
        },
        unit_amount: orderItem.product.price * 100,
      },
    });
  });

  let user;
  if (userId) {
    // check if user exists in db based on provided userId
    user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  const stripeSessionData: Stripe.Checkout.SessionCreateParams = {
    line_items: lineItems,
    submit_type: 'pay',
    mode: 'payment',
    customer: user?.stripeCustomerId || undefined,
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
      userId: userId ? userId : '',
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
  };

  if (user?.stripeCustomerId) {
    stripeSessionData.customer_update = {
      shipping: 'auto',
    };
  }
  const session = await stripe.checkout.sessions.create(stripeSessionData);

  return NextResponse.json({ url: session.url });
}
