import { Breadcrumb } from '@components/Breadcrumb';
import { Filter, Sort } from '@components/Filter';
import { ProductList } from '@components/Product';
import ProductListSkeleton from '@components/Product/ProductListSkeleton';
import { fetchProducts } from '@actions/fetch-products';
import { Suspense } from 'react';
import PaginationSkeleton from '@components/Product/PaginationSkeleton';
import { Pagination } from '@components/Pagination';

export default async function Products({
  searchParams,
}: {
  searchParams: {
    page?: string;
    sort?: string;
    keyword?: string;
    category?: string | string[];
  };
}) {
  const { page, sort, keyword, category } = searchParams;

  const products = await fetchProducts(page, 0, sort, keyword, category);

  return (
    <div className="bg-white">
      <div>
        <Breadcrumb />
        <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          {/* Filters */}
          <section
            aria-labelledby="filter-heading"
            className="border-t border-gray-200 pt-6"
          >
            <h2 id="filter-heading" className="sr-only">
              Product filters
            </h2>
            <div className="flex items-center justify-between">
              <Sort />
              <Filter />
            </div>
          </section>
          {/* Products */}
          <Suspense fallback={<ProductListSkeleton length={8} />}>
            <section className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
              <ProductList
                showCategory
                page={page}
                limit={12}
                sort={sort}
                keyword={keyword}
                category={category}
                products={products}
              />
            </section>
          </Suspense>
          <Suspense fallback={<PaginationSkeleton />}>
            <Pagination
              page={page}
              limit={12}
              sort={sort}
              keyword={keyword}
              category={category}
              products={products}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
