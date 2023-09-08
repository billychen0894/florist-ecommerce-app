import { prisma } from '@lib/prisma';
import { stripe } from '@lib/stripe';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  // due to it's webhook it has to be text not json
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e: any) {
    return new NextResponse(`Webhook Error: ${e.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;
  const email = session?.customer_details?.email;
  const name = session?.customer_details?.name;
  const phone = session?.customer_details?.phone;

  if (event.type === 'checkout.session.completed') {
    const order = await prisma.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        contactEmail: email,
        orderStatus: OrderStatus.PROCESSING,
        paymentStatus: PaymentStatus.PAID,
        contactPhone: phone,
        shippingAddress: {
          connectOrCreate: {
            where: {
              postalCode: address?.postal_code!,
            },
            create: {
              addressLine1: address?.line1!,
              addressLine2: address?.line2,
              city: address?.city!,
              stateOrProvince: address?.state!,
              postalCode: address?.postal_code!,
              country: address?.country!,
            },
          },
        },
        billingAddress: {
          connectOrCreate: {
            where: {
              postalCode: address?.postal_code!,
            },
            create: {
              addressLine1: address?.line1!,
              addressLine2: address?.line2,
              city: address?.city!,
              stateOrProvince: address?.state!,
              postalCode: address?.postal_code!,
              country: address?.country!,
            },
          },
        },
        guest: {
          connectOrCreate: {
            where: {
              email: email!,
            },
            create: {
              email: email!,
              name: name,
            },
          },
        },
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
