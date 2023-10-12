'use client';

import Image from '@node_modules/next/image';
import { TProduct } from '@lib/types/api';
import { usePathname, useRouter } from 'next/navigation';

interface AdminProductListItem {
  product: TProduct;
}
export default function AdminProductListItem({
  product,
}: AdminProductListItem) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <li
      className="flex gap-x-4 px-3 py-5 hover:bg-gray-100 cursor-pointer"
      data-productid={product.id}
      onClick={(e) => {
        const params = new URLSearchParams(window.location.search);
        if (params.has('productId') && e.currentTarget.dataset.productid) {
          params.delete('productId');
          params.append('productId', e.currentTarget.dataset.productid);
        } else if (
          !params.has('productId') &&
          e.currentTarget.dataset.productid
        ) {
          params.append('productId', e.currentTarget.dataset.productid);
        }
        router.replace(`${pathname}?${params.toString()}`);
      }}
    >
      <Image
        className="h-12 w-12 flex-none rounded-full bg-gray-50"
        src={product.images[0].url}
        alt={product.images[0].alt}
        width={500}
        height={500}
      />
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-6 text-gray-900">
          {product.name}
        </p>
        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
          {product.categories.map((category) => category.name).join(' ')}
        </p>
      </div>
    </li>
  );
}
