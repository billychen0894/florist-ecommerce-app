import { fetchCategories } from '@actions/fetch-categories';
import { getProductById } from '@actions/productsActions';
import { options } from '@app/api/auth/[...nextauth]/options';
import AdminProductDetailsForm from '@components/Admin/AdminProductDetailsForm';
import Spinner from '@components/ui/Spinner';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function ProductInAdmin({
  params,
}: {
  params: { productId: string };
}) {
  const session = await getServerSession(options);
  if (!session || session?.user.role !== 'admin') {
    redirect('/denied');
  }

  const product = await getProductById(params.productId);

  if (!product) {
    notFound();
  }

  const categories = await fetchCategories();

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Product Edit
          </h1>
        </div>
      </header>
      <Suspense
        fallback={
          <Spinner className="text-primary-500 h-16 w-16 mx-auto mt-24" />
        }
      >
        <AdminProductDetailsForm
          categories={categories}
          selectedProduct={product}
          mode="edit"
        />
      </Suspense>
    </>
  );
}
