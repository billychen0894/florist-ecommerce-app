import { fetchCategories } from '@actions/fetch-categories';
import { options } from '@app/api/auth/[...nextauth]/options';
import AdminProductDetailsForm from '@components/Admin/AdminProductDetailsForm';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function New() {
  const session = await getServerSession(options);
  if (!session || session?.user.role !== 'admin') {
    redirect('/denied');
  }

  const categories = await fetchCategories();

  return (
    <AdminProductDetailsForm
      categories={categories}
      selectedProduct={undefined}
      mode="create"
    />
  );
}
