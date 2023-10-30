import Button from '@components/ui/Button';
import Spinner from '@components/ui/Spinner';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Input } from '@components/ui';

interface ProductListProps {
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  list: React.ReactElement[] | undefined;
  btnOnClick: () => void;
  btnLabel: string;
  pageHeading: string;
  isSearch: boolean;
}

export default function AdminList({
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  list,
  btnOnClick,
  btnLabel,
  pageHeading,
  isSearch,
}: ProductListProps) {
  return (
    <nav className="scroll-smooth px-2" aria-label="ProductsList">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">{pageHeading}</h2>
        <Button type="button" onClick={btnOnClick}>
          {btnLabel}
        </Button>
      </div>
      {isSearch && (
        <form className="my-6 py-px flex gap-x-4 sticky top-1" action="#">
          <div className="min-w-0 flex-1">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <Input
                type="search"
                name="search"
                id="search"
                placeholder="Search with product name"
                className="py-1.5 pl-10 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </form>
      )}
      <ul role="list" className="divide-y divide-gray-100 mt-2">
        {list}
      </ul>
      <Button
        type="button"
        className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        disabled={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      >
        {isFetchingNextPage ? (
          <div className="flex justify-center items-center">
            <Spinner className="text-primary-500" />
            <span>Loading...</span>
          </div>
        ) : hasNextPage ? (
          'View more'
        ) : (
          'No more to load'
        )}
      </Button>
    </nav>
  );
}
