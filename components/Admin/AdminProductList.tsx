'use client';

import { TProduct } from '@lib/types/api';
import { fetchProducts } from '@actions/fetch-products';
import Button from '@components/ui/Button';
import { useInfiniteQuery } from '@tanstack/react-query';
import Spinner from '@components/ui/Spinner';
import { Fragment } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Input } from '@components/ui';
import AdminProductListItem from '@components/Admin/AdminProductListItem';

interface ProductListProps {
  products: TProduct[];
  keyword: string | undefined;
}

export default function AdminProductList({
  products,
  keyword,
}: ProductListProps) {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['query', keyword],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await fetchProducts(
          pageParam,
          12,
          undefined,
          undefined,
          keyword
        );
        return response;
      },
      getNextPageParam: (lastPage, allPages) => {
        const limit = 12;
        const nextPage =
          lastPage.length === limit ? allPages.length + 1 : undefined;
        return nextPage;
      },
      initialData: {
        pages: [products],
        pageParams: [1],
      },
    });

  return (
    <nav
      className="h-screen overflow-y-scroll scroll-smooth px-2"
      aria-label="ProductsList"
    >
      <h2 className="text-lg font-medium text-gray-900">Product List</h2>
      <form className="my-6 py-px flex gap-x-4 sticky top-0" action="#">
        <div className="min-w-0 flex-1">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <Input
              type="search"
              name="search"
              id="search"
              placeholder="Search with product name"
              className="py-1.5 pl-10 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </form>
      <ul role="list" className="divide-y divide-gray-100">
        {data?.pages.map((productsPage, idx) => (
          <Fragment key={idx}>
            {productsPage.map((product) => (
              <AdminProductListItem product={product} key={product.id} />
            ))}
          </Fragment>
        ))}
      </ul>
      <Button
        type="button"
        className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        disabled={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      >
        {isFetchingNextPage ? (
          <div className="flex justify-center items-center">
            <Spinner className="text-primary-500" />
            <span>Loading...</span>
          </div>
        ) : hasNextPage ? (
          'View more'
        ) : (
          'No more products to load'
        )}
      </Button>
    </nav>
  );
}
