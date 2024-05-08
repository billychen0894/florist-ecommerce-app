import { options } from '@/app/api/auth/[...nextauth]/options';
import SignInForm from '@/components/Auth/SignInForm';
import AuthBackgroundImage from '@/components/Images/AuthBackgroundImage';
import Logo from '@/public/images/logo.png';
import { getServerSession } from 'next-auth/next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function SignIn() {
  const session = await getServerSession(options);

  if (session) {
    redirect('/');
  }

  return (
    <>
      <div className="relative flex h-screen min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <AuthBackgroundImage />
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            className="mx-auto max-h-[6rem] w-auto"
            src={Logo}
            alt="Company Logo"
            sizes="96px"
          />
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <SignInForm />
            <div>
              <p className="mt-10 text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="font-semibold leading-6 text-secondary-500 hover:text-secondary-400"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
