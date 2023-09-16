import Row from '@components/Table/Row';
import StickyHeader from '@components/Table/StickyHeader';

// Display: invoice history with stripe invoice link and its fullfillment status
const people = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  // More people...
];

export default function Orders() {
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
                  <StickyHeader>View Invoice Details</StickyHeader>
                  <StickyHeader>
                    <span className="sr-only">Edit</span>
                  </StickyHeader>
                </tr>
              </thead>
              <tbody>
                <Row rowIndex={0} orders={[]} invoiceHref="#" />
                <Row rowIndex={0} orders={[]} invoiceHref="#" />
                <Row rowIndex={0} orders={[]} invoiceHref="#" />
                <Row rowIndex={0} orders={[]} invoiceHref="#" />
                <Row rowIndex={0} orders={[]} invoiceHref="#" />
                <Row rowIndex={0} orders={[]} invoiceHref="#" />
                <Row rowIndex={0} orders={[]} invoiceHref="#" />
                <Row rowIndex={0} orders={[]} invoiceHref="#" />
                <Row rowIndex={0} orders={[]} invoiceHref="#" />
                <Row rowIndex={0} orders={[]} invoiceHref="#" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
