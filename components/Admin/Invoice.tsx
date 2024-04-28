import { formatDateFullMonth, formatDateYYYYMMDD } from '@/lib/formatTime';
import { Address } from '@/lib/types/api';

interface InvoiceProps {
  invoiceNumber: string;
  issueDate: string;
  shipmentETA: string;
  billingAddress: Address;
  shippingAddress: Address;
  form?: React.ReactElement;
}

export default function Invoice({
  invoiceNumber,
  issueDate,
  shipmentETA,
  billingAddress,
  shippingAddress,
  form,
}: InvoiceProps) {
  return (
    <div className="-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 ">
      <h2 className="text-base font-semibold leading-6 text-gray-600">
        Invoice{' '}
        <span className="text-sm font-normal leading-6 text-gray-600">
          {invoiceNumber}
        </span>
      </h2>
      <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
        <div className="sm:pr-4">
          <dt className="inline text-gray-500">Issued on</dt>{' '}
          <dd className="inline text-gray-700">
            <time dateTime={formatDateYYYYMMDD(issueDate)}>
              {formatDateFullMonth(issueDate)}
            </time>
          </dd>
        </div>
        <div className="mt-2 sm:mt-0 sm:pl-4">
          <dt className="inline text-gray-500">Estimated Arrival</dt>{' '}
          <dd className="inline text-gray-700">
            <time dateTime={formatDateYYYYMMDD(shipmentETA)}>
              {formatDateFullMonth(shipmentETA)}
            </time>
          </dd>
        </div>
        <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
          <dt className="font-semibold text-gray-900">Billing address</dt>
          <dd className="mt-2 text-gray-500">
            <br />
            {`${
              billingAddress.addressLine2
                ? billingAddress.addressLine2 + ' '
                : ''
            }${billingAddress.addressLine1}`}
            <br />
            {`${billingAddress.city}, ${billingAddress.stateOrProvince} ${billingAddress.postalCode} ${billingAddress.country}`}
          </dd>
        </div>
        <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
          <dt className="font-semibold text-gray-900">Shipping address</dt>
          <dd className="mt-2 text-gray-500">
            <br />
            {`${
              shippingAddress.addressLine2
                ? shippingAddress.addressLine2 + ' '
                : ''
            }${shippingAddress.addressLine1}`}
            <br />
            {`${shippingAddress.city}, ${shippingAddress.stateOrProvince} ${shippingAddress.postalCode} ${shippingAddress.country}`}
          </dd>
        </div>
      </dl>
      {form}
    </div>
  );
}
