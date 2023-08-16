import { products } from '@lib/api/products';
import { generatePagination } from '@lib/generatePagination';
import { PaginationLink } from './PaginationLink';

interface PaginationProps {
  pageCount: number;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function Pagination({ searchParams, pageCount }: PaginationProps) {
  const currentPage =
    typeof searchParams.page === 'string' ? searchParams.page : '1';

  const productsListResponse = await products.getAllProducts(
    undefined,
    undefined,
    'asc'
  );
  const productsList = productsListResponse?.data?.data
    ? productsListResponse.data.data
    : [];
  const totalPages = Math.ceil(productsList.length / pageCount);
  const pagination = generatePagination(parseInt(currentPage), totalPages);
  return (
    <nav
      aria-label="Pagination"
      className="mx-auto mt-8 mb-16 flex max-w-7xl justify-between text-sm font-medium text-gray-700"
    >
      <div className="min-w-0 flex-1">
        <PaginationLink
          href={
            currentPage === '1'
              ? ''
              : `/products?page=${String(Number(currentPage) - 1)}`
          }
          disabled={currentPage === '1'}
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
              current={page === currentPage}
            >
              {page}
            </PaginationLink>
          )
        )}
      </div>
      <div className="flex min-w-0 flex-1 justify-end">
        <PaginationLink
          href={
            currentPage === pagination[pagination.length - 1]
              ? ''
              : `/products?page=${String(Number(currentPage) + 1)}`
          }
          disabled={currentPage === pagination[pagination.length - 1]}
        >
          Next
        </PaginationLink>
      </div>
    </nav>
  );
}
