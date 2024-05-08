import { formatCurrency } from '@/lib/formatCurrency';
import { TProduct } from '@/lib/types/types';

interface ProductInfoProps {
  product: TProduct | null;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <>
      <h1
        className="text-3xl font-bold tracking-tight text-gray-900"
        data-cy="product-name"
      >
        {product?.name}
      </h1>
      <div className="mt-3 space-y-3">
        <h2 className="sr-only">Product information</h2>
        <p
          className="text-sm tracking-tight text-shades-400"
          data-cy="product-category"
        >
          {product?.categories.map((category) => category.name).join(', ')}
        </p>
        <p
          className="text-3xl tracking-tight text-secondary-500"
          data-cy="product-price"
        >
          {formatCurrency(product?.price as number, 'en-CA', 'CAD')}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="sr-only">Description</h3>
        <span
          className="space-y-6 text-base text-shades-500"
          data-cy="product-description"
        >
          {product?.description}
        </span>
      </div>
    </>
  );
}
