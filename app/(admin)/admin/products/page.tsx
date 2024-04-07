import { fetchCategories } from '@actions/fetch-categories';
import { fetchProducts } from '@actions/productsActions';
import AdminProduct from '@components/Admin/AdminProduct';

export default async function Products({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const keyword =
    typeof searchParams.search === 'string' ? searchParams?.search : undefined;
  const productId =
    typeof searchParams.productId === 'string' ? searchParams.productId : null;

  const productsResult = await fetchProducts(
    '1',
    0,
    'newest',
    undefined,
    keyword
  );

  const categories = await fetchCategories();

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Products
          </h1>
        </div>
      </header>
      <div className="mx-auto max-w-7xl py-8 sm:px-4 lg:px-12">
        <AdminProduct
          products={productsResult}
          keyword={keyword}
          categories={categories}
          productId={productId}
        />
      </div>
    </>
  );
}
