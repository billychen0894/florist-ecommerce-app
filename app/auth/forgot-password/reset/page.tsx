import ResetForm from '@components/Auth/ResetForm';
import { redirect } from 'next/navigation';

type ResetProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export const dynamic = 'force-dynamic';

export default function Reset({ searchParams }: ResetProps) {
  const token =
    typeof searchParams.token === 'string' ? searchParams.token : null;

  if (!token) {
    redirect('/');
  }

  return (
    <main className="min-h-full flex flex-col justify-center items-center bg-white px-6 py-24 lg:px-8 space-y-6">
      <div className="text-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Please reset your password
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Please enter your email address and new password.
        </p>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px] ">
        <ResetForm />
      </div>
    </main>
  );
}
