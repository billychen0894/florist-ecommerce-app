'use client';

import InvoiceSummary from '@components/Admin/InvoiceSummary';
import Invoice from '@components/Admin/Invoice';
import InvoiceEditForm from '@components/Admin/InvoiceEditForm';
import { useEffect, useState } from 'react';
import Stripe from 'stripe';
import { fetchStripeInvoice } from '@actions/fetchStripeInvoice';
import Spinner from '@components/ui/Spinner';

export default function InvoiceEdit({
  params,
}: {
  params: { orderNumber: string };
}) {
  const [invoice, setInvoice] = useState<Stripe.Invoice>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getStripeInvoice = async (orderNumber: string) => {
      if (orderNumber) {
        const invoice = await fetchStripeInvoice(orderNumber);
        setInvoice(invoice);
        setIsLoading(false);
      }
    };

    getStripeInvoice(params.orderNumber);
  }, [params.orderNumber]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {isLoading && (
        <Spinner className="text-primary-500 h-16 w-16 mx-auto mt-24" />
      )}
      {!isLoading && (
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
            form={<InvoiceEditForm invoiceId={params.orderNumber} />}
          />
        </div>
      )}
    </div>
  );
}
