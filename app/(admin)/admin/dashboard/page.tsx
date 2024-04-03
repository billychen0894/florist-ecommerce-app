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
            <div className="flex justify-center items-center">
              <Spinner className="text-secondary-500 h-12 w-12 my-12" />
            </div>
          }
        >
          <StatCards />
        </Suspense>
      </div>
    </div>
  );
}
