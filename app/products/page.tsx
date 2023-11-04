import { fetchProducts } from '@actions/fetch-products';
import { Breadcrumb } from '@components/Breadcrumb';
import { Filter, Sort } from '@components/Filter';
import { ProductList } from '@components/Product';

import { fetchCategories } from '@actions/fetch-categories';
import { Pagination } from '@components/Pagination';
import { generateBase64 } from '@actions/generateBase64';
import BannerImage from '@components/Images/BannerImage';

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
  const bannerBase64Url = await generateBase64(
    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/vjuw8dkm6btwiuow82xa`
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
              <Filter categories={categoriesResult} />
            </div>
          </section>
          {/* Products */}
          <section className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
            {productsResult.length > 0 ? (
              <ProductList productsList={productsResult} showCategory />
            ) : (
              <p className="text-sm text-gray-400 col-span-full text-center">
                No products found.
              </p>
            )}
          </section>
          <Pagination pageCount={12} searchParams={searchParams} />
        </main>
      </div>
    </div>
  );
}
