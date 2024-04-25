'use client';

import { Category } from '@prisma/client';
import AdminCategoryListItem from '@components/Admin/AdminCategoryListItem';
import AdminList from '@components/Admin/AdminList';

type AdminCategoriesProps = {
  categories: Category[] | null;
};

export default function AdminCategories({ categories }: AdminCategoriesProps) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8">
      <AdminList
        list={categories?.map((category) => (
          <AdminCategoryListItem key={category.id} category={category} />
        ))}
        btnUrl="/admin/categories/new-category"
        btnLabel="Add Category"
        isSearch={false}
      />
    </div>
  );
}
