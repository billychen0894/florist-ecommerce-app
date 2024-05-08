import { fetchCategories } from '@/actions/fetch-categories';
import FilterActionButton from '@/components/Product/FilterActionButton';
import FilterForm from '@/components/Product/FilterForm';
import { FilterActionCtxProvider } from '@/contexts/Filter';
import { Category } from '@prisma/client';

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
