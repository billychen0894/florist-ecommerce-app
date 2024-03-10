import { Category } from '@prisma/client';
import FilterForm from '@components/Product/FilterForm';
import FilterActionButton from '@components/Product/FilterActionButton';
import { fetchCategories } from '@actions/fetch-categories';
import { FilterActionCtxProvider } from '@contexts/Filter';

export interface Filter {
  id: string;
  name: string;
  options: Category[] | null;
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
    <FilterActionCtxProvider>
      <FilterActionButton filters={filters} />
      <FilterForm filters={filters} />
    </FilterActionCtxProvider>
  );
}
