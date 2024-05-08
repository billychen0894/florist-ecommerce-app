import Link from 'next/link';

interface CrumbProps {
  href: string;
  crumbName: string;
  last: boolean;
}

export function Crumb({ href, crumbName, last = false }: CrumbProps) {
  // if it's the last crumb, don't make it a link
  if (last) {
    return (
      <li className="text-sm font-medium text-gray-500 hover:text-gray-600">
        {crumbName}
      </li>
    );
  }

  // otherwise, make it a link
  return (
    <li>
      <div className="flex items-center">
        <Link href={href} className="mr-4 text-sm font-medium text-gray-900">
          {crumbName}
        </Link>
        <svg
          viewBox="0 0 6 20"
          aria-hidden="true"
          className="h-5 w-auto text-gray-300"
        >
          <path
            d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z"
            fill="currentColor"
          />
        </svg>
      </div>
    </li>
  );
}
