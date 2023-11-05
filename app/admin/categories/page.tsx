import AdminCategories from '@components/Admin/AdminCategories';

export const dynamic = 'force-static';

export default function Categories() {
  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <AdminCategories />
    </div>
  );
}
