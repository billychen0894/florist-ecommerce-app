import { Breadcrumb } from '@components/Breadcrumb';
import { Filter, Sort } from '@components/Filter';
import { ProductList } from '@components/Product';
import { Pagination } from '@components/Pagination';
import { generateBase64 } from '@actions/generateBase64';
import BannerImage from '@components/Images/BannerImage';
import { Suspense } from 'react';
import PaginationSkeleton from '@components/Product/PaginationSkeleton';
import ProductListSkeleton from '@components/Product/ProductListSkeleton';

const bannerText =
  'Drifting in a sea of flowers, I am lost in the fragrance and beauty.';

export default async function Products({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const bannerBase64Url = await generateBase64(
    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/a_hflip.vflip,c_scale,dpr_auto,h_1080,q_60,w_1920/a_90/v1699079061/vjuw8dkm6btwiuow82xa.webp`
  );

  return (
    <div className="bg-white">
      <div>
        <Breadcrumb />
        <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <BannerImage
            cloudImagePublicId="vjuw8dkm6btwiuow82xa"
            base64Url={bannerBase64Url}
            bannerText={bannerText}
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
