'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@prisma/client';
import { TrashIcon } from '@heroicons/react/20/solid';

interface AdminCategoryListItem {
  category: Category;
}
export default function AdminCategoryListItem({
  category,
}: AdminCategoryListItem) {
  const router = useRouter();
  const pathname = usePathname();
  const categoryId = useSearchParams().get('categoryId');

  return (
    <li
      className={`flex gap-x-4 px-3 py-5 hover:bg-primary-100 cursor-pointer ${
        categoryId === category.id ? 'bg-primary-200' : ''
      }`}
      data-categoryid={category.id}
      onClick={(e) => {
        const params = new URLSearchParams(window.location.search);
        if (params.has('categoryId') && e.currentTarget.dataset.categoryid) {
          params.delete('categoryId');
          params.append('categoryId', e.currentTarget.dataset.categoryid);
        } else if (
          !params.has('categoryId') &&
          e.currentTarget.dataset.categoryid
        ) {
          params.append('categoryId', e.currentTarget.dataset.categoryid);
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }}
    >
      <div className="min-w-0 flex justify-between items-center w-full">
        <p className="text-sm font-semibold leading-6 text-gray-900">
          {category.name}
        </p>
        <div
          className="h-6 w-6 text-red-500 hover:text-gray-400 relative z-10"
          onClick={(e) => {
            //   TODO: DeleteByCategoryId -> show warning model then delete
          }}
        >
          <TrashIcon className="w-full h-full " />
        </div>
      </div>
    </li>
  );
}
