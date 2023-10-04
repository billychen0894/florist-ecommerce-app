import Image from 'next/image';

import { fetchProducts } from '@actions/fetch-products';
import { Breadcrumb } from '@components/Breadcrumb';
import { Filter, Sort } from '@components/Filter';
import { ProductList } from '@components/Product';

import { fetchCategories } from '@actions/fetch-categories';
import { Pagination } from '@components/Pagination';

const bannerText =
  'Drifting in a sea of flowers, I am lost in the fragrance and beauty.';

export default async function Products({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page =
    typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const limit =
    typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 12;
  const sort =
    typeof searchParams.sort === 'string' ? searchParams.sort : 'popular';
  const search =
    typeof searchParams.keyword === 'string' ? searchParams.keyword : undefined;
  const categoryFilters = searchParams.category;

  const productsResult = await fetchProducts(
    page,
    limit,
    sort,
    categoryFilters,
    search
  );
  const categoriesResult = await fetchCategories();

  return (
    <div className="bg-white">
      <div>
        <Breadcrumb />
        <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          {/* Product Header Image */}
          <div className="h-40 w-full relative isolate flex items-end">
            <Image
              src="/images/cover3.jpg"
              alt="Sea of flowers"
              className="absolute inset-0 -z-10 h-full max-h-40 w-full object-cover object-center"
              width={1920}
              height={1080}
            />
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-gray-800 bg-opacity-20 -z-10"
              aria-hidden="true"
            />
            <p className="text-base md:text-xl text-white mb-10 px-8">
              {bannerText}
            </p>
          </div>

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
              <Filter categories={categoriesResult} />
            </div>
          </section>
          {/* Products */}
          <section className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
            <ProductList productsList={productsResult} showCategory />
          </section>
          <Pagination pageCount={12} searchParams={searchParams} />
        </main>
      </div>
    </div>
  );
}
