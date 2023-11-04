import { fetchProducts } from '@actions/fetch-products';
import { formatCurrency } from '@lib/formatCurrency';
import { TProduct } from '@lib/types/api';
import Image from 'next/image';
import Link from 'next/link';

interface ProductsRecommendationProps {
  product: TProduct | null;
  currProductId: string;
}

export async function ProductsRecommendation({
  product,
  currProductId,
}: ProductsRecommendationProps) {
  const productCategories = product?.categories.map(
    (category) => category.name
  );

  const products = await fetchProducts(
    undefined,
    undefined,
    'newest',
    productCategories
  );
  const recommendedFourProducts = products
    .filter((product) => product.id !== currProductId)
    .slice(0, 4);

  return (
    <section
      aria-labelledby="related-heading"
      className="mt-10 border-t border-gray-200 px-4 py-16 sm:px-0"
    >
      <h2 id="related-heading" className="text-xl font-bold text-gray-900">
        You may also like
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {recommendedFourProducts.map((product) => (
          <div key={product.id} className="group relative">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md lg:aspect-none group-hover:opacity-75 lg:h-80">
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                width={280}
                height={320}
                sizes="(min-width: 1360px) 592px, (min-width: 1040px) calc(40vw + 56px), (min-width: 780px) 672px, (min-width: 640px) calc(66.67vw + 165px), 100vw"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-900">
                  <Link href={`/products/${product.id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-shades-500">
                  {product.categories
                    .map((category) => category.name)
                    .join(', ')}
                </p>
              </div>
              <p className="text-sm font-medium text-secondary-500">
                {formatCurrency(product.price, 'en-CA', 'CAD')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
