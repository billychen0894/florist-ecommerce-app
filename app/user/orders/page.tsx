'use client';

import StickyHeader from '@components/Table/StickyHeader';
import { useAppSelector } from '@store/hooks';
import Row from '@components/Table/Row';

export default function Orders() {
  const userOrders = useAppSelector((state) => state.userReducer.userOrders);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="my-10 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <StickyHeader>Invoice Number</StickyHeader>
                  <StickyHeader className="hidden sm:table-cell">
                    Total
                  </StickyHeader>
                  <StickyHeader className="hidden lg:table-cell">
                    Order Status
                  </StickyHeader>
                  <StickyHeader>Payment Status</StickyHeader>
                  <StickyHeader>
                    <span className="sr-only">View Invoice Details</span>
                  </StickyHeader>
                </tr>
              </thead>
              <tbody>
                {userOrders && userOrders.length > 0 ? (
                  userOrders?.map((invoice, idx) => (
                    <Row
                      key={invoice.id}
                      rowIndex={idx}
                      invoice={invoice}
                      invoicesLength={userOrders?.length}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center 'whitespace-nowrap py-10 pl-10 pr-3 text-sm font-medium text-gray-500 sm:pl-6 lg:pl-8'"
                    >
                      No orders. You haven&apos;t placed any orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
