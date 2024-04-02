import { Breadcrumb } from '@components/Breadcrumb';
import { Filter, Sort } from '@components/Filter';
import ProductListView from '@components/Product/ProductsListView';

export default function Products({
  searchParams,
}: {
  searchParams: {
    page?: string;
    sort?: string;
    keyword?: string;
    category?: string | string[];
  };
}) {
  const { page, sort, keyword, category } = searchParams;

  return (
    <div className="bg-white">
      <div>
        <Breadcrumb />
        <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          {/* Filters */}
          <section
            aria-labelledby="filter-heading"
            className="border-t border-gray-200 pt-6"
          >
            <h2 id="filter-heading" className="sr-only">
              Product filters
            </h2>
            <div className="flex items-center justify-between">
              <Sort />
              <Filter />
            </div>
          </section>
          <ProductListView
            page={page}
            sort={sort}
            keyword={keyword}
            category={category}
          />
        </main>
      </div>
    </div>
  );
}
