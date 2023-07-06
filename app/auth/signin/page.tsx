import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

import OAuthProviderButton from '@components/Auth/OAuthProviderButton';
import SignInForm from '@components/Auth/SignInForm';

export default function SignIn() {
  return (
    <>
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
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            {/* Sign In Credential Form */}
            <SignInForm />
            <div>
              <div className="relative mt-10">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-gray-900">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Providers */}
              <div className="mt-6 grid grid-cols-1 gap-4">
                <OAuthProviderButton
                  provider="google"
                  providerLabel="Google"
                  buttonClassName="bg-white text-black/[.54] drop-shadow-sm hover:drop-shadow-md ring-1 ring-black/[.05]"
                  icon={<FcGoogle className="h-5 w-5" aria-hidden="true" />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
