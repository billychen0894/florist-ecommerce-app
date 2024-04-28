'use client';

import { checkout } from '@/actions/checkout';
import { useCartStore } from '@/components/Providers/CartStoreProvider';
import { HoverCard } from '@/components/ui';
import Button from '@/components/ui/Button';
import { shippingHoverCardInfo, taxHoverCardInfo } from '@/const/orderInfo';
import { formatCurrency } from '@/lib/formatCurrency';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function OrderSummary() {
  const { subtotal, cartItems } = useCartStore((state) => state);
  const cartItemsArr = Object.values(cartItems);
  const router = useRouter();
  const { data: session } = useSession();

  const handleCheckout = async () => {
    if (session && session?.user.role === 'admin') {
      return toast.error('Admin cannot proceed to checkout session');
    }

    const outOfStockCartItems = cartItemsArr.filter(
      (cartItem) => cartItem.product.inStock === false
    );

    if (outOfStockCartItems.length > 0) {
      const cartItemsNames = outOfStockCartItems
        .map((item) => item.product.name)
        .join(', ');
      return toast.error(
        `${cartItemsNames} are currently out of stock. Please remove them before proceeding to checkout`
      );
    }

    if (cartItemsArr.length === 0) {
      return toast.error(
        'Your cart is empty. Please add products before proceeding to checkout'
      );
    }

    const data = await checkout(cartItemsArr, session?.user.id);
    if (data?.url) {
      router.push(data.url);
    }
  };

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
        Order summary
      </h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Subtotal</dt>
          <dd className="text-sm font-medium text-gray-900">
            {formatCurrency(subtotal, 'en-CA', 'CAD')}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="flex items-center text-sm text-gray-600">
            <span>Shipping estimate</span>
            <HoverCard
              screenReaderText={shippingHoverCardInfo.screenReaderText}
              hoverCardText={shippingHoverCardInfo.hoverCardText}
            />
          </dt>
          <dd className="text-sm font-medium text-gray-900">
            Not yet calculated
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="flex text-sm text-gray-600">
            <span>Tax estimate</span>
            <HoverCard
              screenReaderText={taxHoverCardInfo.screenReaderText}
              hoverCardText={taxHoverCardInfo.hoverCardText}
            />
          </dt>
          <dd className="text-sm font-medium text-gray-900">
            Not yet calculated
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium text-gray-900">Order total</dt>
          <dd className="text-base font-medium text-gray-900">
            {formatCurrency(subtotal, 'en-CA', 'CAD')}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button
          type="button"
          className={`w-full border border-transparent px-4 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50 ${
            cartItemsArr.length === 0 ? 'cursor-not-allowed' : null
          }`}
          disabled={cartItemsArr.length === 0}
          onClick={handleCheckout}
        >
          Checkout
        </Button>
      </div>
    </section>
  );
}
