'use client';
// temporary solution: pagination is not implemented yet

import { Product } from '@const/products';
import { generatePagination } from '@lib/generatePagination';
import { useSearchParams } from 'next/navigation';
import { PaginationLink } from './PaginationLink';

interface PaginationProps {
  pageCount: number;
  productsList: Product[];
}

export function Pagination({ productsList, pageCount }: PaginationProps) {
  const searchParams = useSearchParams();
  const pageSearchParams = searchParams.get('page');
  const currentPage = pageSearchParams ? parseInt(pageSearchParams) : 1;
  const totalPages = Math.ceil(productsList.length / pageCount);
  const pagination = generatePagination(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mx-auto mt-8 mb-16 flex max-w-7xl justify-between text-sm font-medium text-gray-700"
    >
      <div className="min-w-0 flex-1">
        <PaginationLink
          href={
            pageSearchParams === '1'
              ? ''
              : `/products?page=${String(Number(pageSearchParams) - 1)}`
          }
          disabled={pageSearchParams === '1'}
        >
          Previous
        </PaginationLink>
      </div>
      <div className="hidden space-x-2 sm:flex">
        {pagination.map((page, idx) =>
          page === '...' ? (
            <span
              key={idx}
              className="inline-flex h-10 items-center px-1.5 text-gray-500"
            >
              ...
            </span>
          ) : (
            <PaginationLink
              key={idx}
              href={`/products?page=${page}`}
              current={page === pageSearchParams}
            >
              {page}
            </PaginationLink>
          )
        )}
      </div>
      <div className="flex min-w-0 flex-1 justify-end">
        <PaginationLink
          href={
            pageSearchParams === pagination[pagination.length - 1]
              ? ''
              : `/products?page=${String(Number(pageSearchParams) + 1)}`
          }
          disabled={pageSearchParams === pagination[pagination.length - 1]}
        >
          Next
        </PaginationLink>
      </div>
    </nav>
  );
}
