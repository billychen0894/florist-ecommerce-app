import { fetchProducts } from '@actions/fetch-products';
import AdminProductList from '@components/Admin/AdminProductList';
import AdminProductDetailsForm from '@components/Admin/AdminProductDetailsForm';
import { fetchCategories } from '@actions/fetch-categories';

export default async function Products({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const keyword =
    typeof searchParams.search === 'string' ? searchParams?.search : undefined;

  const productsResult = await fetchProducts(
    undefined,
    12,
    undefined,
    undefined,
    keyword
  );

  const categories = await fetchCategories();

  return (
    <div className="mx-auto max-w-7xl py-8 sm:px-4 lg:px-12">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
        <AdminProductList products={productsResult} keyword={keyword} />
        <AdminProductDetailsForm categories={categories} />
      </div>
    </div>
  );
}
