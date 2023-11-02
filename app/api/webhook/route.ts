import { prisma } from '@lib/prisma';
import { stripe } from '@lib/stripe';
import { PaymentStatus, Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // due to its webhook it has to be text not json
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  const webhookSecret =
    process.env.NODE_ENV === 'development'
      ? process.env.STRIPE_WEBHOOK_SECRET_LOCAL!
      : process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
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
    orderNumber: '',
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

      const lineItems = lineItemsObj?.data.map((item) => item);

      const promises = lineItems.map(async (item) => {
        return new Promise<boolean>(async (resolve) => {
          try {
            const productId = (item.price?.product as Stripe.Product).metadata
              .productId;
            const product = await prisma.product.findUnique({
              where: {
                id: productId,
              },
            });

            if (product) {
              if (item?.quantity && product.units - item?.quantity < 0)
                throw new Error(
                  'Checkout Failed: current stocks cannot satisfy orders'
                );

              const updatedUnits = Math.max(
                product.units - (item?.quantity || 0),
                0
              );
              const updatedIsStock = updatedUnits > 0;

              await prisma.product.update({
                where: {
                  id: productId,
                },
                data: {
                  units: {
                    decrement: item?.quantity as number,
                  },
                  inStock: updatedIsStock,
                },
              });
              resolve(true);
            } else {
              resolve(false);
            }
          } catch (error) {
            console.error(error);
            resolve(false);
          }
        });
      });

      const promisesResult = await Promise.all(promises);
      const isPromisesFailed = promisesResult.includes(false);
      if (isPromisesFailed)
        throw new Error(
          'Checkout Failed: current stocks cannot satisfy orders'
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
            quantity: item?.quantity!,
          }))!,
        },
      };

      await prisma.order.create({
        data: orderData,
      });
      console.log('end - orderData number', orderData.orderNumber);
    }
    return new NextResponse(null, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return new NextResponse(`Error: ${e.message}`, { status: 500 });
  }
}
