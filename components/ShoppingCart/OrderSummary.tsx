import { HoverCard } from '@components/ui';
import Button from '@components/ui/Button';
import { shippingHoverCardInfo } from '@const/orderInfo';

interface OrderSummaryProps {
  subtotal: number;
  shippingEstimate: number;
}

export function OrderSummary({
  subtotal,
  shippingEstimate,
}: OrderSummaryProps) {
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
          <dd className="text-sm font-medium text-gray-900">${subtotal}</dd>
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
            ${shippingEstimate}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium text-gray-900">Order total</dt>
          <dd className="text-base font-medium text-gray-900">
            ${subtotal + shippingEstimate}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button
          type="submit"
          className="w-full border border-transparent px-4 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50"
        >
          Checkout
        </Button>
      </div>
    </section>
  );
}
