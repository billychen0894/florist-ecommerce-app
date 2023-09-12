import CheckoutSession from '@components/Checkout/CheckoutSession';
import { stripe } from '@lib/stripe';

export default async function Success({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sessionId =
    typeof searchParams.session_id === 'string' ? searchParams?.session_id : '';
  const { invoice, customer_details } = await stripe.checkout.sessions.retrieve(
    sessionId,
    {
      expand: ['invoice'],
    }
  );

  return (
    <main className="bg-white px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl max-h-screen h-[16rem] flex justify-center items-center">
        <CheckoutSession customerDetails={customer_details} invoice={invoice} />
      </div>
    </main>
  );
}
