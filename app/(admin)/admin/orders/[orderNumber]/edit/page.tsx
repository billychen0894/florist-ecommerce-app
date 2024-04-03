import InvoiceSummary from '@components/Admin/InvoiceSummary';
import Invoice from '@components/Admin/Invoice';
import InvoiceEditForm from '@components/Admin/InvoiceEditForm';
import { fetchStripeInvoice } from '@actions/fetchStripeInvoice';
import { getOrders } from '@actions/adminActions';
import { Order } from '@prisma/client';
import Stripe from 'stripe';

export default async function InvoiceEdit({
  params,
}: {
  params: { orderNumber: string };
}) {
  const promises: [
    Promise<Stripe.Invoice | undefined>,
    Promise<Order[] | null>
  ] = [fetchStripeInvoice(params?.orderNumber), getOrders()];

  const [invoice, orders] = await Promise.all(promises);
  const order = orders?.find(
    (order) => order.stripeInvoiceId === params?.orderNumber
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <InvoiceSummary
          amount={Number(invoice?.total)}
          status={invoice?.status ? 'Paid' : 'Unpaid'}
          name={invoice?.customer_name!}
          email={invoice?.customer_email!}
          phone={invoice?.customer_phone!}
          paymentMethod={'visa'}
          invoiceUrl={invoice?.hosted_invoice_url! || '#'}
        />

        <Invoice
          invoiceNumber={invoice?.number!}
          issueDate={invoice?.created.toString()!}
          shipmentETA={(invoice?.created! + 14 * 24 * 60 * 60).toString()}
          billingAddress={{
            addressLine1: invoice?.customer_address?.line1!,
            addressLine2: invoice?.customer_address?.line2!,
            city: invoice?.customer_address?.city!,
            stateOrProvince: invoice?.customer_address?.state!,
            postalCode: invoice?.customer_address?.postal_code!,
            country: invoice?.customer_address?.country!,
          }}
          shippingAddress={{
            addressLine1: invoice?.shipping_details?.address?.line1!,
            addressLine2: invoice?.shipping_details?.address?.line2!,
            city: invoice?.shipping_details?.address?.city!,
            stateOrProvince: invoice?.shipping_details?.address?.state!,
            postalCode: invoice?.shipping_details?.address?.postal_code!,
            country: invoice?.shipping_details?.address?.country!,
          }}
          form={<InvoiceEditForm order={order} />}
        />
      </div>
    </div>
  );
}
