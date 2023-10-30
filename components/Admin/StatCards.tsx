'use client';

import { useAppSelector } from '@store/hooks';
import StatCard from '@components/ui/StatCard';
import { formatCurrency } from '@lib/formatCurrency';
import { TProduct } from '@lib/types/api';
import { Category } from '@prisma/client';

type StatCardsProps = {
  products: TProduct[];
  categories: Category[];
};

export default function StatCards({ products, categories }: StatCardsProps) {
  const accountUsers = useAppSelector(
    (state) => state.adminReducer.accountUsers
  );
  const orders = useAppSelector((state) => state.adminReducer.orders);
  const totalRevenue = orders.reduce((pre, curr) => {
    return pre + curr.total;
  }, 0);

  return (
    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <StatCard
        name="Total Account Users"
        stat={accountUsers.length.toString()}
      />
      <StatCard name="Total Orders" stat={orders.length.toString()} />
      <StatCard
        name="Revenue"
        stat={formatCurrency(totalRevenue, 'en-CA', 'CAD')}
      />
      <StatCard name="Total SKU" stat={products.length.toString()} />
      <StatCard name="Total Categories" stat={categories.length.toString()} />
    </dl>
  );
}
