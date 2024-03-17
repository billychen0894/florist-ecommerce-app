import { generatePagination } from '@lib/generatePagination';
import { PaginationLink } from './PaginationLink';
import { parseSearchParams } from '@lib/parseSearchParams';
import { TProducts } from '@lib/types/types';

function constructURL(
  baseURL: string,
  page?: string,
  sort?: string,
  keyword?: string,
  category?: string[]
) {
  const params = new URLSearchParams();
  if (page) {
    params.set('page', page);
  }

  if (sort) {
    params.set('sort', sort);
  }

  if (keyword) {
    params.set('keyword', keyword);
  }

  if (category) {
    if (category?.length > 1) {
      category.forEach((cat) => {
        params.append('category', cat);
      });
    }

    if (category?.length === 1) {
      params.set('category', category[0]);
    }
  }

  return `${baseURL}?${params.toString()}`;
}

interface PaginationProps {
  page?: string;
  limit: number;
  sort?: string;
  keyword?: string;
  category?: string | string[];
  products: TProducts;
}

export async function Pagination({
  page,
  limit,
  sort,
  keyword,
  category,
  products,
}: PaginationProps) {
  const {
    page: currentPage,
    sort: sortOption,
    keyword: search,
    category: categoryFilters,
  } = parseSearchParams(page, limit, sort, keyword, category);

  const totalPages = products ? Math.ceil(products?.length / limit) : 0;
  const pagination = generatePagination(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mx-auto mt-8 mb-16 flex max-w-7xl justify-between text-sm font-medium text-gray-700"
    >
      <div className="min-w-0 flex-1">
        <PaginationLink
          href={
            String(currentPage) === '1'
              ? '#'
              : constructURL(
                  '/products',
                  String(currentPage - 1),
                  sortOption,
                  search,
                  categoryFilters
                )
          }
          disabled={String(currentPage) === '1'}
        >
          Previous
        </PaginationLink>
      </div>
      <div className="hidden space-x-2 sm:flex">
        {pagination?.map((page, idx) =>
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
              href={constructURL(
                '/products',
                page,
                sortOption,
                search,
                categoryFilters
              )}
              current={page === String(currentPage)}
            >
              {page}
            </PaginationLink>
          )
        )}
      </div>
      <div className="flex min-w-0 flex-1 justify-end">
        <PaginationLink
          href={
            String(currentPage) === pagination[pagination.length - 1]
              ? '#'
              : constructURL(
                  '/products',
                  String(currentPage + 1),
                  sortOption,
                  search,
                  categoryFilters
                )
          }
          disabled={String(currentPage) === pagination[pagination.length - 1]}
        >
          Next
        </PaginationLink>
      </div>
    </nav>
  );
}
