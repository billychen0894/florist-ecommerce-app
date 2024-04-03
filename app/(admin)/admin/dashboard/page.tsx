import { redirect } from '@node_modules/next/navigation';
import StatCards from '@components/Admin/StatCards';
import { getServerSession } from 'next-auth/next';
import { options } from '@app/api/auth/[...nextauth]/options';
import { fetchCategories } from '@actions/fetch-categories';
import { fetchProducts } from '@actions/productsActions';
import { Suspense } from 'react';
import Spinner from '@components/ui/Spinner';

export default async function Dashboard() {
  const session = await getServerSession(options);

  if (session?.user.role !== 'admin') {
    redirect('/denied');
  }

  const products = await fetchProducts('1', 0, 'newest', undefined, undefined);
  const categories = await fetchCategories();

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div>
        <Suspense
          fallback={
            <div className="flex justify-center items-center">
              <Spinner className="text-secondary-500 h-12 w-12 my-12" />
            </div>
          }
        >
          <StatCards products={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
