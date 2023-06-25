import { Product } from '@const/products';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {product.name}
      </h1>
      <div className="mt-3">
        <h2 className="sr-only">Product information</h2>
        <p className="text-3xl tracking-tight text-secondary-500">
          ${product.price}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="sr-only">Description</h3>
        <span className="space-y-6 text-base text-shades-500">
          {product.description}
        </span>
      </div>
    </>
  );
}