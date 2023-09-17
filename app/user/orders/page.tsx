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
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <StickyHeader>Invoice Number</StickyHeader>
                  <StickyHeader>Total</StickyHeader>
                  <StickyHeader>Order Status</StickyHeader>
                  <StickyHeader>Payment Status</StickyHeader>
                  <StickyHeader>
                    <span className="sr-only">View Invoice Details</span>
                  </StickyHeader>
                </tr>
              </thead>
              <tbody>
                {invoicesAndOrdersCombined?.map((invoice, idx) => (
                  <Row
                    key={invoice.id}
                    rowIndex={idx}
                    invoice={invoice}
                    invoicesLength={invoicesAndOrdersCombined?.length}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
