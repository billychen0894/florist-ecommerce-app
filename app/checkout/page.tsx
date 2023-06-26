import { CheckoutForm } from '@components/CheckoutForm';

export default function Checkout() {
  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="sr-only">Checkout</h1>
          <CheckoutForm />
        </div>
      </main>
    </div>
  );
}
