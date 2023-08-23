'use server';

import { categories } from '@lib/api/categories';

export async function fetchCategories() {
  const categoriesResult = await categories.getAllCategories();
  const allCategories = categoriesResult.data.data
    ? categoriesResult.data.data
    : [];
  return allCategories;
}
