'use client';

import StickyHeader from '@components/Table/StickyHeader';
import Row from '@components/Table/Row';
import { useAppSelector } from '@store/hooks';
import RowData from '@components/Table/RowData';
import Link from 'next/link';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

type CustomerOrdersProps = {
  params: { customerId: string };
};

export default function CustomerOrders({ params }: CustomerOrdersProps) {
  const [customer] = useAppSelector(
    (state) => state.adminReducer.accountUsers
  ).filter((customer) => customer?.id === params?.customerId);
  const orders = useAppSelector((state) => state.adminReducer.orders).filter(
    (order) => order?.userId === params?.customerId
  );

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div>
        <div className="rounded-lg bg-gray-50 px-4 py-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
          <dl className="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-8">
            <div className="flex justify-between sm:block">
              <dt className="font-medium text-gray-900">Customer name</dt>
              <dd className="sm:mt-1">{customer?.name || 'unspecified'}</dd>
            </div>
            <div className="flex justify-between pt-6 sm:block sm:pt-0">
              <dt className="font-medium text-gray-900">Email</dt>
              <dd className="sm:mt-1">{customer?.email || 'unspecified'}</dd>
            </div>
            <div className="flex justify-between pt-6 sm:block sm:pt-0">
              <dt className="font-medium text-gray-900">Phone</dt>
              <dd className="sm:mt-1">{customer?.phone || 'unspecified'}</dd>
            </div>
            <div className="flex justify-between pt-6 sm:block sm:pt-0">
              <dt className="font-medium text-gray-900">Join</dt>
              <dd className="sm:mt-1">
                <time
                  dateTime={new Date(customer?.createdAt).toLocaleDateString()}
                >
                  {new Date(customer?.createdAt).toLocaleDateString() ||
                    'unspecified'}
                </time>
              </dd>
            </div>
          </dl>
        </div>
        <table className="min-w-full border-separate border-spacing-0 mt-2">
          <thead>
            <tr>
              <StickyHeader>Invoice Number</StickyHeader>
              <StickyHeader className="hidden sm:table-cell">
                Total
              </StickyHeader>
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
                        href={`/admin/orders/${invoice.stripeInvoiceId}/edit`}
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
    </div>
  );
}
