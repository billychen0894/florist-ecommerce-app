import Image from 'next/image';
import { cn } from '@lib/classNames';

interface AvatarProps {
  avatarImageUrl: string;
  avatarImageAlt: string;
  className?: string;
}

export function Avatar({
  className,
  avatarImageUrl,
  avatarImageAlt,
}: AvatarProps) {
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
    <div className={cn('group relative h-6 w-6 sm:h-7 sm:w-7', className)}>
      <div className="absolute top-0 left-0 w-full h-full rounded-full group-hover:bg-gray-500/20 transition" />
      {avatarImage}
    </div>
  );
}
