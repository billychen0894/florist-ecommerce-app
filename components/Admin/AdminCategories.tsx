'use client';

import AdminProductList from '@components/Admin/AdminList';
import { Fragment, useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAppSelector } from '@store/hooks';
import { categories } from '@lib/api/categories';
import { Category } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminCategoryListItem from '@components/Admin/AdminCategoryListItem';

export default function AdminCategories() {
  const categoryId = useSearchParams().get('categoryId');
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const categoriesList = useAppSelector(
    (state) => state.adminReducer.categories
  );
  const firstCategoriesPage = categoriesList.slice(0, 12);
  const router = useRouter();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['categories'],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await categories.getAllCategories();
        const limit = 12;
        const skip = (pageParam - 1) * limit;
        if (response?.data && response?.data?.data) {
          return response.data.data.slice(skip, pageParam * limit);
        }
      },
      getNextPageParam: (lastPage, allPages) => {
        const limit = 12;
        const nextPage =
          lastPage?.length === limit ? allPages?.length + 1 : undefined;
        return nextPage;
      },
      initialData: {
        pages: [firstCategoriesPage],
        pageParams: [1],
      },
    });

  useEffect(() => {
    if (data) {
      const categories = data.pages.flat();
      const category = categories.find(
        (category) => category?.id === categoryId
      );

      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [data, categoryId]);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8">
      <AdminProductList
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        list={data?.pages.map((categoriesPage, idx) => (
          <Fragment key={idx}>
            {categoriesPage?.map((category) => (
              <AdminCategoryListItem
                key={category.id}
                category={category}
                selectedCategory={selectedCategory}
              />
            ))}
          </Fragment>
        ))}
        btnOnClick={() => {
          router.push('/admin/categories/new-category');
        }}
        btnLabel="Add Category"
        pageHeading="Category List"
        isSearch={false}
      />
    </div>
  );
}
