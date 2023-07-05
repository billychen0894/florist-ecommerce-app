import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface AvatarProps {
  avatarImageUrl: string;
  avatarImageAlt: string;
}

export function Avatar({ avatarImageUrl, avatarImageAlt }: AvatarProps) {
  let avatarImage = (
    <Image
      src={avatarImageUrl}
      alt={avatarImageAlt}
      width={24}
      height={24}
      className="h-full w-full object-cover object-center"
    />
  );

  if (!avatarImageUrl) {
    avatarImage = (
      <svg
        className="h-full w-full text-gray-300"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  }

  return (
    <span className="inline-block h-6 w-6 sm:h-7 sm:w-7 overflow-hidden rounded-full bg-gray-100">
      <Link href="#" onClick={() => signOut()}>
        {avatarImage}
      </Link>
    </span>
  );
}
