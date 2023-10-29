'use client';

import { useAppSelector } from '@store/hooks';
import CustomerCard from '@components/Admin/CustomerCard';

export default function Customers() {
  const customers = useAppSelector((state) => state.adminReducer.accountUsers);

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
      >
        {customers?.map((customer) => (
          <CustomerCard key={customer?.id} customer={customer} />
        ))}
      </ul>
    </div>
  );
}
