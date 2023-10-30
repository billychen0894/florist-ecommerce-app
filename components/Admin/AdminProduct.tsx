'use client';

import AdminProductList from '@components/Admin/AdminList';
import AdminProductDetailsForm from '@components/Admin/AdminProductDetailsForm';
import { TProduct } from '@lib/types/api';
import { Category } from '@node_modules/@prisma/client';
import { Fragment, useEffect, useState } from 'react';
import SlideOver from '@components/ui/SlideOver';
import { fetchProducts } from '@actions/fetch-products';
import { useInfiniteQuery } from '@tanstack/react-query';
import AdminProductListItem from '@components/Admin/AdminProductListItem';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
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
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        list={data?.pages.map((productsPage, idx) => (
          <Fragment key={idx}>
            {productsPage.map((product) => (
              <AdminProductListItem
                product={product}
                key={product.id}
                setOpen={setOpen}
              />
            ))}
          </Fragment>
        ))}
        btnOnClick={() => {
          router.push('/admin/products/new-product');
        }}
        btnLabel="Add Product"
        pageHeading="Product List"
        isSearch
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
