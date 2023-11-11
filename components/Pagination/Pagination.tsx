import { generatePagination } from '@lib/generatePagination';
import { PaginationLink } from './PaginationLink';
import { fetchProducts } from '@actions/fetch-products';

interface PaginationProps {
  pageCount: number;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function Pagination({ searchParams, pageCount }: PaginationProps) {
  const currentPage =
    typeof searchParams.page === 'string' ? searchParams.page : '1';
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : '';
  const search =
    typeof searchParams.keyword === 'string' ? searchParams.keyword : undefined;
  const categoryFilters = searchParams.category;

  const products = await fetchProducts(
    undefined,
    undefined,
    sort,
    categoryFilters,
    search
  );

  const totalPages = Math.ceil(products.length / pageCount);
  const pagination = generatePagination(parseInt(currentPage), totalPages);

  const categoryFiltersURLParams = Array.isArray(categoryFilters)
    ? categoryFilters.length > 1
      ? `&category=${categoryFilters.join('&category=')}`
      : `&category=${categoryFilters.join('')}`
    : typeof categoryFilters === 'string'
    ? `&category=${categoryFilters}`
    : '';

  return (
    <nav
      aria-label="Pagination"
      className="mx-auto mt-8 mb-16 flex max-w-7xl justify-between text-sm font-medium text-gray-700"
    >
      <div className="min-w-0 flex-1">
        <PaginationLink
          href={
            currentPage === '1'
              ? '#'
              : `/products?page=${String(Number(currentPage) - 1)}${
                  sort ? '&sort=' + sort : ''
                }${categoryFiltersURLParams}${
                  search ? '&keyword=' + search : ''
                }`
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
              href={`/products?page=${page}${
                sort ? '&sort=' + sort : ''
              }${categoryFiltersURLParams}${
                search ? '&keyword=' + search : ''
              }`}
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
              ? '#'
              : `/products?page=${String(Number(currentPage) + 1)}${
                  sort ? '&sort=' + sort : ''
                }${categoryFiltersURLParams}${
                  search ? '&keyword=' + search : ''
                }`
          }
          disabled={currentPage === pagination[pagination.length - 1]}
        >
          Next
        </PaginationLink>
      </div>
    </nav>
  );
}
