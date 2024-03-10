import { fetchProducts } from '@actions/fetch-products';
import { fetchCategories } from '@actions/fetch-categories';
import AdminProduct from '@components/Admin/AdminProduct';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    1,
    12,
    'newest',
    undefined,
    keyword
  );

  const categories = await fetchCategories();

  return (
    <div className="mx-auto max-w-7xl py-8 sm:px-4 lg:px-12">
      <AdminProduct
        products={productsResult}
        keyword={keyword}
        categories={categories}
        productId={productId}
      />
    </div>
  );
}
