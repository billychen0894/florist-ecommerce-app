import { cn } from '@lib/classNames';
import Link from 'next/link';

interface PaginationLinkProps {
  href: string;
  children: React.ReactNode;
  current?: boolean;
  disabled?: boolean;
}

export function PaginationLink({
  href,
  current = false,
  disabled = false,
  children,
}: PaginationLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        current
          ? 'border-secondary-500 ring-1 ring-secondary-500'
          : 'border-gray-300',
        disabled ? 'text-gray-300 pointer-events-none' : 'text-gray-700',
        'inline-flex h-10 items-center rounded-md border bg-white px-4 hover:bg-gray-100 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-secondary-500'
      )}
    >
      {children}
    </Link>
  );
}
