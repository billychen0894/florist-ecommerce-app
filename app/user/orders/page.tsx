'use client';

import Row from '@components/Table/Row';
import StickyHeader from '@components/Table/StickyHeader';
import { Order } from '@lib/types/api';
import { useAppSelector } from '@store/hooks';

export default function Orders() {
  const invoices = useAppSelector((state) => state.userReducer.invoices);
  const orders = useAppSelector((state) => state.userReducer.orders);
  const invoicesAndOrdersCombined = invoices?.data.map((invoice) => {
    const [mappedInvoice] = orders?.filter(
      (order) => order.orderNumber === invoice?.number
    ) as Order[];

    return {
      ...invoice,
      orderStatus: mappedInvoice?.orderStatus,
    };
  });

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
                {invoicesAndOrdersCombined &&
                invoicesAndOrdersCombined.length > 0 ? (
                  invoicesAndOrdersCombined?.map((invoice, idx) => (
                    <Row
                      key={invoice.id}
                      rowIndex={idx}
                      invoice={invoice}
                      invoicesLength={invoicesAndOrdersCombined?.length}
                    />
                  ))
                ) : invoicesAndOrdersCombined &&
                  invoicesAndOrdersCombined.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center 'whitespace-nowrap py-10 pl-10 pr-3 text-sm font-medium text-gray-500 sm:pl-6 lg:pl-8'"
                    >
                      No orders. You haven&apos;t placed any orders yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
