import { Avatar } from '@components/ui';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

interface AuthenticationButtonsProps {
  isMobile: boolean;
}

function AuthenticationButtons({ isMobile }: AuthenticationButtonsProps) {
  const { data: session, status } = useSession();

  if (session && status === 'authenticated') {
    return (
      <Avatar
        avatarImageUrl={session?.user.image}
        avatarImageAlt={session?.user.name}
      />
    );
  }

  if (status === 'loading') {
    return null;
  }

  return (
    <>
      {isMobile && (
        <>
          <div className="flow-root">
            <span
              onClick={() => signIn()}
              className="-m-2 block p-2 font-medium text-gray-900 hover:text-secondary-500 cursor-pointer"
            >
              Sign in
            </span>
          </div>
          <div className="flow-root">
            <Link
              href="/sign-up"
              className="-m-2 block p-2 font-medium text-gray-900 hover:text-secondary-500"
            >
              Create account
            </Link>
          </div>
        </>
      )}

      {!isMobile && (
        <div
          className={
            'hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'
          }
        >
          <span
            onClick={() => signIn()}
            className="text-sm font-medium text-gray-700 hover:text-secondary-500 cursor-pointer"
          >
            Sign in
          </span>
          <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
          <Link
            href="/sign-up"
            className="text-sm font-medium text-gray-700 hover:text-secondary-500"
          >
            Create account
          </Link>
        </div>
      )}
    </>
  );
}

export default AuthenticationButtons;
