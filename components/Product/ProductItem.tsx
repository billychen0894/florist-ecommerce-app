import { Category, Image as ImageType, Product } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

interface ProductItemProps {
  product: Product & { images: ImageType[] } & { categories: Category[] };
  showCategory?: boolean;
}

export function ProductItem({
  product,
  showCategory = false,
}: ProductItemProps) {
  return (
    <div className="group relative">
      <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.images[0].url}
          alt={product.images[0].alt}
          className="object-cover object-center"
          width={200}
          height={400}
        />
        <div
          className="flex items-end p-4 opacity-0 group-hover:opacity-100"
          aria-hidden="true"
        >
          <div className="w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-black backdrop-blur backdrop-filter">
            View Product
            <span className="sr-only">{product.name}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between space-x-8 text-base font-medium text-black">
        <h3>
          <Link href={`/products/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-secondary-500">${product.price}</p>
      </div>
      {showCategory &&
        product.categories &&
        product.categories.map((category) => (
          <p key={category.id} className="mt-1 text-sm text-shades-500">
            {category.name}
          </p>
        ))}
    </div>
  );
}
