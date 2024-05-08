import { options } from '@/app/api/auth/[...nextauth]/options';
import UserSubNav from '@/components/Navigation/UserSubNav';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function User({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="mt-2 mx-auto max-w-7xl max-h-max">
      <main>
        <header className="border-y border-black/5">
          <UserSubNav />
        </header>
        {children}
      </main>
    </div>
  );
}
