import { Breadcrumb } from '@components/Breadcrumb';
import { Filter, Sort } from '@components/Filter';
import { ProductList } from '@components/Product';

import { fetchCategories } from '@actions/fetch-categories';
import { Pagination } from '@components/Pagination';
import { generateBase64 } from '@actions/generateBase64';
import BannerImage from '@components/Images/BannerImage';
import { TProduct } from '@lib/types/api';
import { prisma } from '@lib/prisma';
import { parseSearchParams } from '@lib/parseSearchParams';
import { buildQueryFilters } from '@lib/buildQueryFilters';
import { Suspense } from 'react';
import PaginationSkeleton from '@components/Product/PaginationSkeleton';

const bannerText =
  'Drifting in a sea of flowers, I am lost in the fragrance and beauty.';

export async function fetchProducts({
  page,
  limit,
  sort,
  queryFilters,
}: {
  page: number;
  limit: number;
  sort: string;
  queryFilters: any;
}) {
  const price = sort === 'price-high-to-low' ? 'desc' : 'asc';
  const newest = sort === 'newest' ? 'desc' : 'asc';
  const popular = sort === 'popular' ? 'desc' : 'asc';
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        categories: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        { price: price },
        {
          orderItems: {
            _count: popular,
          },
        },
        { createdAt: newest },
      ],
      where: queryFilters,
    });
    return products;
  } catch (err) {
    console.error(err);
  }
}

export default async function Products({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { page, limit, sort, keyword, category } =
    parseSearchParams(searchParams);
  const queryFilters = buildQueryFilters(category, keyword);

  const fetchPromises = [
    await fetchProducts({ page, limit, sort, queryFilters }),
    await fetchCategories(),
    await generateBase64(
      `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/a_hflip.vflip,c_scale,dpr_auto,h_1080,q_60,w_1920/a_90/v1699079061/vjuw8dkm6btwiuow82xa.webp`
    ),
  ];
  const data = (await Promise.all(fetchPromises)) as [
    TProduct[],
    { id: string; name: string; createdAt: Date; updatedAt: Date }[],
    string
  ];
  const [productsResult, categoriesResult, bannerBase64Url] = data;

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
            <Suspense fallback={<div>Loading Products</div>}>
              {productsResult.length > 0 ? (
                <ProductList productsList={productsResult} showCategory />
              ) : (
                <p className="text-sm text-gray-400 col-span-full text-center">
                  No products found.
                </p>
              )}
            </Suspense>
          </section>
          <Suspense fallback={<PaginationSkeleton />}>
            <Pagination pageCount={12} searchParams={searchParams} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
