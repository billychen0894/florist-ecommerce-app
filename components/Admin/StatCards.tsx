import StatCard from '@components/ui/StatCard';
import { formatCurrency } from '@lib/formatCurrency';
import { Category, Order } from '@prisma/client';
import { TProducts, UserWithoutPass } from '@lib/types/types';
import { getAllUsers, getOrders } from '@actions/adminActions';
import { fetchProducts } from '@actions/productsActions';
import { fetchCategories } from '@actions/fetch-categories';

export default async function StatCards() {
  const promises: [
    Promise<UserWithoutPass[] | null>,
    Promise<Order[] | null>,
    Promise<TProducts | null>,
    Promise<Category[] | null>
  ] = [
    getAllUsers(),
    getOrders(),
    fetchProducts('1', 0, 'newest', undefined, undefined),
    fetchCategories(),
  ];

  const [accountUsers, orders, products, categories] = await Promise.all(
    promises
  );

  const totalRevenue = orders
    ? orders?.reduce((pre, curr) => {
        return pre + curr.total;
      }, 0)
    : 0;

  return (
    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <StatCard
        name="Total Account Users"
        stat={accountUsers?.length.toString() || ''}
      />
      <StatCard name="Total Orders" stat={orders?.length.toString() || ''} />
      <StatCard
        name="Revenue"
        stat={formatCurrency(totalRevenue, 'en-CA', 'CAD')}
      />
      <StatCard name="Total SKU" stat={products?.length.toString() || ''} />
      <StatCard
        name="Total Categories"
        stat={categories?.length.toString() || ''}
      />
    </dl>
  );
}
