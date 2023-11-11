import {
  ProductActions,
  ProductDetails,
  ProductImageGallery,
  ProductInfo,
  ProductsRecommendation,
} from '@components/Product';
import { products } from '@lib/api/products';
import { notFound } from '@node_modules/next/dist/client/components/not-found';
import { Metadata } from 'next';
import React, { Suspense } from 'react';
import SkeletonProductsRecommend from '@components/Product/SkeletonProductsRecommend';

type Props = {
  params: { product: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productId = params.product;
  const productResult = await products.getProductById(productId);
  const product = productResult?.data.data;

  return {
    title: product?.name,
    description: product?.description,
    keywords: product?.categories.map((category) => category.name),
  };
}

export default async function Product({
  params,
}: {
  params: { product: string };
}) {
  const productResult = await products.getProductById(params.product);
  if (!productResult) {
    notFound();
    return;
  }
  const product = productResult && productResult?.data?.data;

  return (
    <>
      <div className="bg-white">
        <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            {/* Product */}
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              {/* Image gallery */}
              <ProductImageGallery product={product} />

              {/* Product info */}
              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <ProductInfo product={product} />
                <ProductActions productId={params.product} product={product} />
                <ProductDetails product={product} />
              </div>
            </div>

            <Suspense fallback={<SkeletonProductsRecommend />}>
              <ProductsRecommendation
                product={product}
                currProductId={params.product}
              />
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
}
