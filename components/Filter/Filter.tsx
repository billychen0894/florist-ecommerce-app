import { Category } from '@prisma/client';
import FilterForm from '@components/Product/FilterForm';
import FilterActionButton from '@components/Product/FilterActionButton';
import { fetchCategories } from '@actions/fetch-categories';

export interface Filter {
  id: string;
  name: string;
  options: Category[];
}

export async function Filter() {
  const categories = await fetchCategories();

  const filters: Filter[] = [
    {
      id: 'category',
      name: 'Category',
      options: categories,
    },
  ];

  return (
    <>
      <FilterActionButton filters={filters} />
      <FilterForm filters={filters} />
    </>
  );
}
