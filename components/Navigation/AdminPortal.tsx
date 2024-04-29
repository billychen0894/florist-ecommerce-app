'use client';

import Link from 'next/link';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

export default function AdminPortal() {
  const { data: session } = useSession();

  if (!session || session?.user?.role !== 'admin') return null;

  return (
    <div className="ml-4 flow-root lg:ml-6 relative">
      <Link
        href={{ pathname: '/admin/dashboard' }}
        className="group -m-2 flex items-center p-2"
        data-cy="admin-portal-link"
      >
        <PencilSquareIcon
          className="h-6 w-6 flex-shrink-0 text-red-500 group-hover:text-red-400"
          aria-hidden="true"
        />
        <span className="sr-only">Admin Edit</span>
      </Link>
    </div>
  );
}
