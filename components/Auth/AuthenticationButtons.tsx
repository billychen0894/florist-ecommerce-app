import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

import { Avatar } from '@components/ui';
import UserAcccountDropdown from '@components/ui/UserAccountDropdown';

interface AuthenticationButtonsProps {
  isMobile?: boolean;
  onOpen?: (open: boolean) => void;
}

function AuthenticationButtons({
  isMobile,
  onOpen,
}: AuthenticationButtonsProps) {
  const { data: session, status } = useSession();

  if (session && status === 'authenticated') {
    const userAccountDropdownMenu = isMobile ? null : (
      <UserAcccountDropdown
        email={session?.user.email as string}
        avatar={
          <Avatar
            avatarImageUrl={session?.user.image}
            avatarImageAlt={session?.user.name}
          />
        }
      />
    );

    return userAccountDropdownMenu;
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
              onClick={() => {
                onOpen && onOpen(false);
                signIn();
              }}
              className="-m-2 block p-2 font-medium text-gray-900 hover:text-secondary-500 cursor-pointer"
            >
              Sign in
            </span>
          </div>
          <div className="flow-root">
            <Link
              href="/auth/signup"
              className="-m-2 block p-2 font-medium text-gray-900 hover:text-secondary-500"
              onClick={() => onOpen && onOpen(false)}
            >
              Create account
            </Link>
          </div>
        </>
      )}

      {!isMobile && (
        <div
          className={
            'hidden sm:flex sm:flex-1 sm:items-center sm:justify-end sm:space-x-6'
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
            href="/auth/signup"
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
