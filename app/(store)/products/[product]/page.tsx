import {
  ProductActions,
  ProductDetails,
  ProductImageGallery,
  ProductInfo,
  ProductsRecommendation,
} from '@components/Product';
import { notFound } from '@node_modules/next/dist/client/components/not-found';
import { Metadata } from 'next';
import React, { Suspense } from 'react';
import SkeletonProductsRecommend from '@components/Product/SkeletonProductsRecommend';
import { getProductById } from '@actions/getProductById';

type Props = {
  params: { product: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productId = params.product;
  const productResult = await getProductById(productId);
  const product = productResult?.data;

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
  const productResult = await getProductById(params.product);

  if (!productResult?.data) {
    notFound();
  }

  return (
    <>
      <div className="bg-white">
        <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            {/* Product */}
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              {/* Image gallery */}
              <ProductImageGallery product={productResult?.data} />

              {/* Product info */}
              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <ProductInfo product={productResult?.data} />
                <ProductActions
                  productId={params.product}
                  product={productResult?.data}
                />
                <ProductDetails product={productResult?.data} />
              </div>
            </div>

            <Suspense fallback={<SkeletonProductsRecommend />}>
              <ProductsRecommendation
                product={productResult?.data}
                currProductId={params.product}
              />
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
}
