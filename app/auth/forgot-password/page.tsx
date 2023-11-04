import { getServerSession } from 'next-auth/next';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { options } from '@app/api/auth/[...nextauth]/options';
import ForgotPasswordForm from '@components/Auth/ForgotPasswordForm';

export default async function ForgotPassword() {
  const session = await getServerSession(options);

  // If the user is logged in, redirect to the homepage
  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="relative flex h-screen min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Image with backdrop to fill in the container */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full" aria-hidden="true">
          <Image
            className="h-full w-full object-cover object-top"
            src="/images/cover2.jpg"
            alt="Background Image"
            width={1600}
            height={900}
            priority
          />
          <div className="absolute inset-0 bg-gray-500 opacity-25" />
        </div>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto max-h-[6rem] w-auto"
          src="/images/logo.png"
          alt="Company Logo"
          width={75}
          height={75}
        />
        <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Forgot Password?
        </h2>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          {/* Sign In Credential Form */}
          <ForgotPasswordForm />

          <p className="mt-10 text-center text-sm text-gray-500">
            Enter the email address associated with your account and we&apos;ll
            send you a link to reset your password.
          </p>
        </div>
      </div>
    </div>
  );
}
