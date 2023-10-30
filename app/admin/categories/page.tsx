import AdminCategories from '@components/Admin/AdminCategories';

export default function Categories({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const categoryId =
    typeof searchParams.categoryId === 'string'
      ? searchParams.categoryId
      : null;
  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <AdminCategories categoryId={categoryId} />
    </div>
  );
}
