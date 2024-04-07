import { redirect } from '@node_modules/next/navigation';
import StatCards from '@components/Admin/StatCards';
import { getServerSession } from 'next-auth/next';
import { options } from '@app/api/auth/[...nextauth]/options';
import { Suspense } from 'react';
import Spinner from '@components/ui/Spinner';

export default async function Dashboard() {
  const session = await getServerSession(options);

  if (session?.user.role !== 'admin') {
    redirect('/denied');
  }

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div>
          <Suspense
            fallback={
              <Spinner className="text-primary-500 h-16 w-16 mx-auto mt-24" />
            }
          >
            <StatCards />
          </Suspense>
        </div>
      </div>
    </>
  );
}
