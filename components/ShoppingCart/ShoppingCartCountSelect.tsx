'use client';

import Button from '@components/ui/Button';

import { XMarkIcon } from '@heroicons/react/20/solid';
import { TProduct } from '@lib/types/api';
import {
  removeItemFromCart,
  updateCartItemQuantity,
} from '@store/features/cartSlice';
import { useAppDispatch } from '@store/hooks';

interface ShoppingCartCountSelectProps {
  product: TProduct;
  selectCounts: number;
  selectedQuantity: number;
}

export function ShoppingCartCountSelect({
  product,
  selectedQuantity,
  selectCounts,
}: ShoppingCartCountSelectProps) {
  const dispatch = useAppDispatch();

  const handleChangeCartItemQuantity = (
    itemId: string,
    newSelectedQuantity: number
  ) => {
    dispatch(updateCartItemQuantity({ itemId, quantity: newSelectedQuantity }));
  };

  const handleRemoveCartItem = (itemId: string) => {
    dispatch(removeItemFromCart({ itemId }));
  };

  return (
    <div className="mt-4 sm:mt-0 sm:pr-9">
      <label htmlFor={`quantity-${product.id}`} className="sr-only">
        Quantity, {product.name}
      </label>
      <select
        id={`quantity-${product.id}`}
        name={`quantity-${product.name}`}
        value={selectedQuantity > 10 ? 10 : selectedQuantity}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const newQuantity = e.target.value;
          handleChangeCartItemQuantity(product.id, Number(newQuantity));
        }}
        className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
      >
        {[...Array(selectCounts)].map((_, i) => {
          const isProductUnitsLessThanSelectUnit =
            product !== null && product?.units < i + 1;
          return (
            <option
              key={i}
              value={i + 1}
              disabled={isProductUnitsLessThanSelectUnit}
            >
              {i + 1}
            </option>
          );
        })}
      </select>

      <div className="absolute right-0 top-0">
        <Button
          type="button"
          className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500 bg-transparent hover:bg-transparent shadow-none"
          onClick={() => {
            handleRemoveCartItem(product.id);
          }}
        >
          <span className="sr-only">Remove</span>
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
