import { Order } from '@prisma/client';
import Link from 'next/link';
import RowData from './RowData';

interface RowProps {
  rowIndex: number;
  orders: Order[];
  invoiceHref: string;
}
export default function Row({ rowIndex, orders, invoiceHref }: RowProps) {
  return (
    <tr>
      <RowData rowIndex={rowIndex} orders={orders}>
        test
      </RowData>
      <RowData rowIndex={rowIndex} orders={orders}>
        test
      </RowData>
      <RowData rowIndex={rowIndex} orders={orders}>
        test
      </RowData>
      <RowData rowIndex={rowIndex} orders={orders}>
        test
      </RowData>
      <RowData rowIndex={rowIndex} orders={orders}>
        test
      </RowData>
      <RowData rowIndex={rowIndex} orders={orders}>
        <Link
          href={invoiceHref}
          className="text-secondary-500 hover:text-secondary-300"
        >
          View Invoice<span className="sr-only">, {''}</span>
        </Link>
      </RowData>
    </tr>
  );
}
