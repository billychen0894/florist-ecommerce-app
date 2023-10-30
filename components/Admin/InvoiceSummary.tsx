import {
  CreditCardIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
} from '@node_modules/@heroicons/react/20/solid';
import { formatCurrency } from '@lib/formatCurrency';
import Link from 'next/link';

interface InvoiceSummaryProps {
  amount: number;
  status: 'Paid' | 'Unpaid';
  name: string;
  email: string;
  phone: string;
  paymentMethod: string;
  invoiceUrl: string;
}

export default function InvoiceSummary({
  amount,
  status,
  name,
  email,
  phone,
  paymentMethod,
  invoiceUrl,
}: InvoiceSummaryProps) {
  return (
    <div className="lg:col-start-3 lg:row-end-1">
      <h2 className="sr-only">Summary</h2>
      <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
        <dl className="flex flex-wrap">
          <div className="flex-auto pl-6 pt-6">
            <dt className="text-sm font-semibold leading-6 text-gray-900">
              Amount
            </dt>
            <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
              {formatCurrency(amount / 100, 'en-CA', 'CAD')}
            </dd>
          </div>
          <div className="flex-none self-end px-6 pt-4">
            <dt className="sr-only">Status</dt>
            <dd className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20">
              {status}
            </dd>
          </div>
          <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
            <dt className="flex-none">
              <span className="sr-only">Client</span>
              <UserCircleIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />
            </dt>
            <dd className="text-sm font-medium leading-6 text-gray-900">
              {name}
            </dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Email</span>
              <EnvelopeIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />
            </dt>
            <dd className="text-sm font-medium leading-6 text-gray-900">
              {email}
            </dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Phone</span>
              <PhoneIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
            </dt>
            <dd className="text-sm font-medium leading-6 text-gray-900">
              {phone}
            </dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Status</span>
              <CreditCardIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />
            </dt>
            <dd className="text-sm leading-6 text-gray-500">
              Paid with {paymentMethod}
            </dd>
          </div>
        </dl>
        <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
          <Link
            href={invoiceUrl}
            className="text-sm font-semibold leading-6 text-primary-500"
          >
            View Invoice <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
