import { generateUniqueNumber } from '@lib/generateUniqueNumber';
import { prisma } from '@lib/prisma';
import { stripe } from '@lib/stripe';
import { PaymentStatus, Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

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
  const billingAddress = session?.customer_details?.address;
  const shippingAddress = session?.shipping_details?.address;
  const email = session?.customer_details?.email;
  const name =
    session?.shipping_details?.name || session?.customer_details?.name;
  const phone =
    session?.shipping_details?.phone || session?.customer_details?.phone;

  const orderData: Prisma.OrderCreateInput = {
    orderNumber: generateUniqueNumber('BL'),
    total: session?.amount_total! / 100,
    contactEmail: email,
    paymentStatus: PaymentStatus.PAID,
    contactPhone: phone,
    shippingAddress: {
      connectOrCreate: {
        where: {
          postalCode: shippingAddress?.postal_code!,
        },
        create: {
          addressLine1: shippingAddress?.line1!,
          addressLine2: shippingAddress?.line2,
          city: shippingAddress?.city!,
          stateOrProvince: shippingAddress?.state!,
          postalCode: shippingAddress?.postal_code!,
          country: shippingAddress?.country!,
        },
      },
    },
    billingAddress: {
      connectOrCreate: {
        where: {
          postalCode: billingAddress?.postal_code!,
        },
        create: {
          addressLine1: billingAddress?.line1!,
          addressLine2: billingAddress?.line2,
          city: billingAddress?.city!,
          stateOrProvince: billingAddress?.state!,
          postalCode: billingAddress?.postal_code!,
          country: billingAddress?.country!,
        },
      },
    },
  };

  // if it's guest checkout then connect/create guest in db
  if (!session?.metadata?.userId) {
    orderData.guest = {
      connectOrCreate: {
        where: {
          email: email!,
        },
        create: {
          email: email!,
          name: name,
          stripeCustomerId: session?.customer as string,
        },
      },
    };
  } else {
    orderData.user = {
      connect: { id: session?.metadata?.userId },
    };

    await prisma.user.update({
      where: {
        id: session?.metadata?.userId,
      },
      data: {
        stripeCustomerId: session?.customer as string,
        phone,
      },
    });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const lineItemsObj = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          expand: ['data.price.product'],
        }
      );

      const invoiceObj = await stripe.invoices.retrieve(
        session?.invoice as string
      );
      // Replace orderNumber with Invoice number issued by Stripe
      orderData.orderNumber = invoiceObj.number!;
      orderData.stripeInvoiceId = invoiceObj.id;
      orderData.invoiceUrl = invoiceObj.hosted_invoice_url;

      orderData.orderItems = {
        createMany: {
          data: lineItemsObj?.data.map((item) => ({
            productId: (item.price?.product as Stripe.Product).metadata
              .productId,
            quantity: item.quantity!,
          }))!,
        },
      };

      await prisma.order.create({
        data: orderData,
      });
    }
    return new NextResponse(null, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return new NextResponse(`Error: ${e.message}`, { status: 500 });
  }
}
