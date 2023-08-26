import { HeartIcon } from '@heroicons/react/24/outline';

import {
  ProductDetails,
  ProductImageGallery,
  ProductInfo,
  ProductsRecommendation,
} from '@components/Product';
import Button from '@components/ui/Button';
import { products } from '@lib/api/products';

export default async function Product({
  params,
}: {
  params: { product: string };
}) {
  const productResult = await products.getProductById(params.product);
  const product = productResult.data.data;
  return (
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

              <form className="mt-6">
                <div className="mt-10 flex">
                  <div className="flex mr-4">
                    <label
                      htmlFor={`quantity-${params.product}`}
                      className="sr-only"
                    >
                      Quantity, {product?.name}
                    </label>
                    <select
                      id={`quantity-${params.product}`}
                      name={`quantity-${params.product}`}
                      className="max-w-full rounded-md border border-gray-300 py-1.5 text-center text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    type="submit"
                    className="flex max-w-xs flex-1 items-center justify-center border border-transparent px-8 py-3 text-base font-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                  >
                    Add to cart
                  </Button>

                  <Button
                    type="button"
                    className="ml-4 flex items-center justify-center px-3 py-3 text-secondary-400 bg-transparent shadow-none hover:bg-gray-100 hover:text-secondary-500"
                  >
                    <HeartIcon
                      className="h-6 w-6 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Add to favorites</span>
                  </Button>
                </div>
              </form>
              <ProductDetails product={product} />
            </div>
          </div>

          <ProductsRecommendation
            product={product}
            currProductId={params.product}
          />
        </div>
      </main>
    </div>
  );
}
