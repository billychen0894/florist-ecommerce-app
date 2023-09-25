'use server';

import { stripe } from '@lib/stripe';

export const updateStripeCustomer = async (customerId: string, data: {}) => {
  try {
    if (!customerId) {
      throw new Error('customerId is not supplied');
    }

    await stripe.customers.update(customerId, data);

    return true;
  } catch (err: any) {
    console.log('Error: ', err.message);
  }
};

export const createStripeCustomer = async (data: {}) => {
  try {
    if (!data) {
      throw new Error('No data supplied for stripe customer creation');
    }

    const newCustomer = await stripe.customers.create(data);

    return newCustomer.id;
  } catch (err: any) {
    console.log('Error: ', err.message);
  }
};
