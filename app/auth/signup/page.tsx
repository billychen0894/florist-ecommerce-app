import Image from 'next/image';
import Link from 'next/link';

import SignUpForm from '@components/Auth/SignUpForm';

export default function SignUp() {
  return (
    <>
      <div className="relative flex h-[1000px] min-h-full flex-1 flex-col py-6 sm:py-6 sm:px-6">
        {/* Background Image with backdrop to fill in the container */}
        <div className="absolute inset-0 -z-10">
          <div className="w-full h-full" aria-hidden="true">
            <Image
              className="h-full w-full object-cover object-top"
              src="/images/cover2.jpg"
              alt="Background Image"
              width={1600}
              height={900}
            />
            <div className="absolute inset-0 bg-gray-500 opacity-25" />
          </div>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            className="mx-auto h-24 w-auto"
            src="/images/logo.png"
            alt="Company Logo"
            width={120}
            height={120}
          />
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-12">
            <SignUpForm />
            <div>
              <p className="mt-10 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="font-semibold leading-6 text-secondary-500 hover:text-secondary-400"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
