import { getOrders } from '@/actions/adminActions';
import { options } from '@/app/api/auth/[...nextauth]/options';
import Row from '@/components/Table/Row';
import RowData from '@/components/Table/RowData';
import StickyHeader from '@/components/Table/StickyHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Orders() {
  const session = await getServerSession(options);

  if (session?.user.role !== 'admin') {
    redirect('/denied');
  }

  const orders = await getOrders();

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Orders
          </h1>
        </div>
      </header>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
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
    </>
  );
}
