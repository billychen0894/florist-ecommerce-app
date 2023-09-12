'use client';

import { useRouter } from 'next/navigation';
import Stripe from 'stripe';

import Button from '@components/ui/Button';
import { resetCart } from '@store/features/cartSlice';
import { useAppDispatch } from '@store/hooks';
import { useEffect } from 'react';

interface CheckoutSessionProps {
  customerDetails: Stripe.Checkout.Session.CustomerDetails | null;
  invoice: string | Stripe.Invoice | null;
}

export default function CheckoutSession({
  customerDetails,
  invoice,
}: CheckoutSessionProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Reset Redux CartItems and localStorage
  useEffect(() => {
    if (customerDetails) {
      dispatch(resetCart());
    }
  }, [customerDetails, dispatch]);

  return (
    <>
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary-500">
          Order Successful!
        </h1>
        <p className="mt-2 text-xl text-gray-700">
          Thank you,{' '}
          <span className="font-bold text-secondary-400">
            {customerDetails?.name}
          </span>
        </p>
        <p className="mt-2 text-base text-gray-500">
          We hope you enjoy your purchase. Thank you for shopping with us!
        </p>
        <div className="mt-8 space-x-4">
          <Button
            type="button"
            onClick={() => {
              router.push('/');
            }}
          >
            Go back home
          </Button>
          <Button
            type="button"
            className="bg-secondary-500 hover:bg-secondary-300"
            onClick={() => {
              router.push((invoice as Stripe.Invoice)?.hosted_invoice_url!);
            }}
          >
            View Invoice
          </Button>
        </div>
      </div>
    </>
  );
}
