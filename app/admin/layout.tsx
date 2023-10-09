import AdminNavigation from '@components/Admin/AdminNavigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full">
      <AdminNavigation />
      <main>{children}</main>
    </div>
  );
}
