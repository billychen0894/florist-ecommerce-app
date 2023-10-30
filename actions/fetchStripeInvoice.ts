'use server';

import { stripe } from '@lib/stripe';

export const fetchStripeInvoice = async (invoiceId: string) => {
  try {
    if (!invoiceId) {
      throw new Error('Invoice id is required');
    }

    const invoice = await stripe.invoices.retrieve(invoiceId);

    return invoice;
  } catch (err: any) {
    console.error('Error: ', err.message);
  }
};
