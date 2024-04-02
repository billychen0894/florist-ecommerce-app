import { Suspense } from 'react';
import { ProductList } from './ProductList';
import ProductListSkeleton from './ProductListSkeleton';
import PaginationSkeleton from './PaginationSkeleton';
import { Pagination } from '@components/Pagination';
import { fetchProducts } from '@actions/productsActions';

interface ProductListViewProps {
  page?: string;
  sort?: string;
  keyword?: string;
  category?: string | string[];
}

export default async function ProductListView({
  page,
  sort,
  keyword,
  category,
}: ProductListViewProps) {
  const products = await fetchProducts(page, 0, sort, keyword, category);

  return (
    <>
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
    </>
  );
}
