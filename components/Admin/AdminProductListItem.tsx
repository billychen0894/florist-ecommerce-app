'use client';

import { TProduct } from '@/lib/types/types';
import Image from 'next/image';
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
      className="flex gap-x-4 px-3 py-5 hover:bg-primary-100 cursor-pointer"
      data-productid={product?.id}
      onClick={(e) => {
        const productId = e.currentTarget.getAttribute('data-productid');
        router.push(`${pathname}/${productId}`);
      }}
    >
      <Image
        className="h-12 w-12 flex-none rounded-full bg-gray-50"
        src={product?.images[0]?.url || ''}
        alt={product?.images[0]?.alt || ''}
        width={48}
        height={48}
        sizes="48px"
      />
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-6 text-gray-900">
          {product?.name}
        </p>
        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
          {product?.categories.map((category) => category?.name).join(' ')}
        </p>
      </div>
    </li>
  );
}
