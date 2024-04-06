import AdminNavigation from '@components/Admin/AdminNavigation';
import { redirect } from '@node_modules/next/navigation';
import { getServerSession } from 'next-auth';
import { options } from '@app/api/auth/[...nextauth]/options';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);

  if (!session || session?.user.role !== 'admin') {
    redirect('/denied');
  }

  return (
    <div className="min-h-full">
      <AdminNavigation session={session} />
      <main>{children}</main>
    </div>
  );
}
