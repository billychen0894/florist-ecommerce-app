import { formatCurrency } from '@lib/formatCurrency';
import { $Enums } from '@prisma/client';
import Link from 'next/link';
import Stripe from 'stripe';
import RowData from './RowData';

interface RowProps {
  rowIndex: number;
  invoice: Stripe.Invoice & { orderStatus: $Enums.OrderStatus };
  invoicesLength: number;
}
export default function Row({ rowIndex, invoice, invoicesLength }: RowProps) {
  return (
    <tr>
      <RowData rowIndex={rowIndex} invoiceLength={invoicesLength}>
        {invoice.number}
      </RowData>
      <RowData rowIndex={rowIndex} invoiceLength={invoicesLength}>
        {formatCurrency(Number(invoice.total / 100), 'en-CA', 'CAD')}
      </RowData>
      <RowData rowIndex={rowIndex} invoiceLength={invoicesLength}>
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
      <RowData rowIndex={rowIndex} invoiceLength={invoicesLength}>
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          {invoice.status === 'paid' ? 'Paid' : 'Unpaid'}
        </span>
      </RowData>
      <RowData rowIndex={rowIndex} invoiceLength={invoicesLength}>
        <Link
          href={
            typeof invoice.hosted_invoice_url === 'string'
              ? invoice.hosted_invoice_url
              : '#'
          }
          className="text-secondary-500 hover:text-secondary-300"
        >
          View invoice<span className="sr-only">, {''}</span>
        </Link>
      </RowData>
    </tr>
  );
}
