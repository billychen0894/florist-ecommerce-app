import { cn } from '@lib/classNames';

interface RowDataProps {
  rowIndex: number;
  invoiceLength: number;
  children: React.ReactNode;
}

export default function RowData({
  rowIndex,
  invoiceLength,
  children,
}: RowDataProps) {
  return (
    <td
      className={cn(
        rowIndex !== invoiceLength - 1 ? 'border-b border-gray-200' : '',
        'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
      )}
    >
      {children}
    </td>
  );
}
