'use client';

import StickyHeader from '@components/Table/StickyHeader';
import Row from '@components/Table/Row';
import { useAppSelector } from '@store/hooks';
import RowData from '@components/Table/RowData';
import Link from 'next/link';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

export default function Orders() {
  const orders = useAppSelector((state) => state.adminReducer.orders);

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <StickyHeader>Invoice Number</StickyHeader>
            <StickyHeader className="hidden sm:table-cell">Total</StickyHeader>
            <StickyHeader className="hidden lg:table-cell">
              Order Status
            </StickyHeader>
            <StickyHeader className="hidden sm:table-cell">
              Payment Status
            </StickyHeader>
            <StickyHeader>
              <span className="sr-only">View Invoice Details</span>
            </StickyHeader>
            <StickyHeader>
              <span className="sr-only">Edit Invoice Details</span>
            </StickyHeader>
          </tr>
        </thead>
        <tbody>
          {orders && orders.length > 0 ? (
            orders?.map((invoice, idx) => (
              <Row
                key={invoice.id}
                rowIndex={idx}
                invoice={invoice}
                invoicesLength={orders?.length}
                additionalRows={
                  <RowData rowIndex={idx} invoiceLength={orders?.length}>
                    <Link
                      href={`/admin/orders/${invoice.orderNumber}/edit`}
                      className="text-blue-500 hover:text-blue-400 flex justify-center items-center gap-1"
                    >
                      <PencilSquareIcon className="h-6 w-6 hidden sm:inline-block" />
                      <span>Edit</span>
                      <span className="sr-only">, {''}</span>
                    </Link>
                  </RowData>
                }
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-center 'whitespace-nowrap py-10 pl-10 pr-3 text-sm font-medium text-gray-500 sm:pl-6 lg:pl-8'"
              >
                No orders.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
