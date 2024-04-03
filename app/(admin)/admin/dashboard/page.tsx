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
  );
}
