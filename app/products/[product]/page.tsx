import { HeartIcon } from '@heroicons/react/24/outline';

import {
  ProductDetails,
  ProductImageGallery,
  ProductInfo,
  ProductsRecommendation,
} from '@components/Product';
import Button from '@components/ui/Button';
import { Product, products } from '@const/products';

const product: Product = products[0];

export default function Product() {
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

          <ProductsRecommendation recommendedProducts={products.slice(0, 4)} />
        </div>
      </main>
    </div>
  );
}
