import { Product } from '@const/products';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface ShoppingCartCountSelectProps {
  product: Product;
  productIdx: number;
  selectCounts: number;
}

export function ShoppingCartCountSelect({
  product,
  productIdx,
  selectCounts,
}: ShoppingCartCountSelectProps) {
  return (
    <div className="mt-4 sm:mt-0 sm:pr-9">
      <label htmlFor={`quantity-${productIdx}`} className="sr-only">
        Quantity, {product.name}
      </label>
      <select
        id={`quantity-${productIdx}`}
        name={`quantity-${productIdx}`}
        className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
      >
        {[...Array(selectCounts)].map((_, i) => (
          <option key={i} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>

      <div className="absolute right-0 top-0">
        <button
          type="button"
          className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Remove</span>
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
