import { Breadcrumb } from '@components/Breadcrumb';
import { Filter, Sort } from '@components/Filter';
import { ProductList } from '@components/Product';
import { Pagination } from '@components/Pagination';
import BannerImage from '@components/Images/BannerImage';
import { Suspense } from 'react';
import PaginationSkeleton from '@components/Product/PaginationSkeleton';
import ProductListSkeleton from '@components/Product/ProductListSkeleton';
import bannerImage from '@public/images/cover3.jpg';

export default async function Products({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="bg-white">
      <div>
        <Breadcrumb />
        <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <BannerImage
            bannerImage={bannerImage}
            bannerImageAlt="Sea of flowers"
            bannerText="Drifting in a sea of flowers, I am lost in the fragrance and beauty."
          />

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
              <Suspense
                fallback={
                  <div className="w-12 h-6 bg-slate-100 animate-pulse rounded" />
                }
              >
                <Filter />
              </Suspense>
            </div>
          </section>
          {/* Products */}
          <Suspense fallback={<ProductListSkeleton length={8} />}>
            <section className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
              <ProductList showCategory searchParams={searchParams} />
            </section>
          </Suspense>
          <Suspense fallback={<PaginationSkeleton />}>
            <Pagination pageCount={12} searchParams={searchParams} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
