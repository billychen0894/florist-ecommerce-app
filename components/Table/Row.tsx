'use client';

import { formatCurrency } from '@lib/formatCurrency';
import { $Enums, Order } from '@prisma/client';
import Link from 'next/link';
import RowData from './RowData';
import { DocumentTextIcon } from '@node_modules/@heroicons/react/24/outline';
import Stripe from 'stripe';

interface RowProps {
  rowIndex: number;
  invoice:
    | (Stripe.Invoice & { orderStatus: $Enums.OrderStatus })
    | (Order & { paymentStatus: $Enums.PaymentStatus });
  invoicesLength: number;
  additionalRows?: React.ReactElement;
}
export default function Row({
  rowIndex,
  invoice,
  invoicesLength,
  additionalRows,
}: RowProps) {
  const invoiceNumber =
    'number' in invoice ? invoice.number : invoice.orderNumber;
  const paymentStatus =
    'status' in invoice
      ? invoice.status
      : 'paymentStatus' in invoice
      ? invoice.paymentStatus
      : 'Error';
  const invoiceUrl =
    'hosted_invoice_url' in invoice
      ? invoice.hosted_invoice_url
      : 'orderNumber' in invoice
      ? invoice.invoiceUrl
      : '#';

  const invoiceTotal =
    'number' in invoice ? Number(invoice.total) / 100 : invoice.total;

  return (
    <tr>
      <RowData rowIndex={rowIndex} invoiceLength={invoicesLength}>
        {invoiceNumber}
      </RowData>
      <RowData
        rowIndex={rowIndex}
        invoiceLength={invoicesLength}
        className="hidden sm:table-cell"
      >
        {formatCurrency(invoiceTotal, 'en-CA', 'CAD')}
      </RowData>
      <RowData
        rowIndex={rowIndex}
        invoiceLength={invoicesLength}
        className="hidden lg:table-cell"
      >
        {invoice.orderStatus ? (
          <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-500 ring-1 ring-inset ring-orange-600/20">
            {invoice.orderStatus.charAt(0) +
              invoice.orderStatus.slice(1).toLowerCase()}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
            Error: contact support
          </span>
        )}
      </RowData>
      <RowData
        rowIndex={rowIndex}
        invoiceLength={invoicesLength}
        className="hidden sm:table-cell"
      >
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          {paymentStatus?.charAt(0).toUpperCase()! +
            paymentStatus?.slice(1).toLowerCase()!}
        </span>
      </RowData>
      <RowData rowIndex={rowIndex} invoiceLength={invoicesLength}>
        <Link
          href={invoiceUrl as string}
          className="text-secondary-500 hover:text-secondary-300 flex justify-center items-center gap-1"
        >
          <DocumentTextIcon className="h-6 w-6 hidden sm:inline-block" />
          <span>View invoice</span>
          <span className="sr-only">, {''}</span>
        </Link>
      </RowData>
      {additionalRows}
    </tr>
  );
}
