'use client';

import AdminProductList from '@components/Admin/AdminProductList';
import AdminProductDetailsForm from '@components/Admin/AdminProductDetailsForm';
import { TProduct } from '@lib/types/api';
import { Category } from '@node_modules/@prisma/client';
import { useEffect, useState } from 'react';
import SlideOver from '@components/ui/SlideOver';
import { fetchProducts } from '@actions/fetch-products';
import { useInfiniteQuery } from '@tanstack/react-query';

type AdminProductProps = {
  products: TProduct[];
  keyword: string | undefined;
  categories: Category[];
  productId: string | null;
};

export default function AdminProduct({
  products,
  keyword,
  categories,
  productId,
}: AdminProductProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<TProduct>();
  const sortedProducts = [...products].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['query', keyword],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await fetchProducts(
          pageParam,
          12,
          'newest',
          undefined,
          keyword
        );
        const sortedProducts = [...response].sort(
          (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
        );
        return sortedProducts;
      },
      getNextPageParam: (lastPage, allPages) => {
        const limit = 12;
        const nextPage =
          lastPage.length === limit ? allPages.length + 1 : undefined;
        return nextPage;
      },
      initialData: {
        pages: [sortedProducts],
        pageParams: [1],
      },
    });

  useEffect(() => {
    if (data && productId) {
      const products = data.pages.flat();
      const product = products.find((product) => product.id === productId);

      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [data, productId]);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8">
      <AdminProductList
        setOpen={setOpen}
        data={data}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
      <SlideOver open={open} setOpen={setOpen}>
        <AdminProductDetailsForm
          categories={categories}
          selectedProduct={selectedProduct}
        />
      </SlideOver>
    </div>
  );
}
