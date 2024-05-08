import { getUser, getUserOrders } from '@/actions/userActions';
import { options } from '@/app/api/auth/[...nextauth]/options';
import Row from '@/components/Table/Row';
import StickyHeader from '@/components/Table/StickyHeader';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Orders() {
  const session = await getServerSession(options);
  if (!session) {
    redirect('/auth/signin');
  }
  const user = await getUser(session?.user?.id);
  const userOrders =
    user && user.stripeCustomerId
      ? await getUserOrders(user?.id, user?.stripeCustomerId)
      : [];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="my-10 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table
              className="min-w-full border-separate border-spacing-0"
              data-cy="orders-table"
            >
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
