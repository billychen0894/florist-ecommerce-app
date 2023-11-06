import { redirect } from '@node_modules/next/navigation';
import StatCards from '@components/Admin/StatCards';
import { getServerSession } from 'next-auth/next';
import { options } from '@app/api/auth/[...nextauth]/options';
import { fetchProducts } from '@actions/fetch-products';
import { fetchCategories } from '@actions/fetch-categories';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const session = await getServerSession(options);

  if (session?.user.role !== 'admin') {
    redirect('/denied');
  }

  const products = await fetchProducts(1, 0, 'newest', undefined, undefined);
  const categories = await fetchCategories();

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div>
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Last 30 days
        </h3>
        <StatCards products={products} categories={categories} />
      </div>
    </div>
  );
}
