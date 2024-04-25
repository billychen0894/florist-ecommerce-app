import { fetchCategories } from '@actions/fetch-categories';
import AdminCategories from '@components/Admin/AdminCategories';

export default async function Categories() {
  const categories = await fetchCategories();

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Categories
          </h1>
        </div>
      </header>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <AdminCategories categories={categories} />
      </div>
    </>
  );
}
