'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

import {
  addToUserWishlist,
  removeProductFromWishlist,
} from '@/actions/userActions';
import { useCartStore } from '@/components/Providers/CartStoreProvider';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Notification from '@/components/ui/Notification';
import { cn } from '@/lib/classNames';
import { TProduct, TWishlist } from '@/lib/types/types';

interface ProductActionsProps {
  productId: string;
  product: TProduct | null;
  userWishlist: TWishlist | null;
}

export function ProductActions({
  productId,
  product,
  userWishlist,
}: ProductActionsProps) {
  const { data: session } = useSession();
  const { addItemToCart, cartItems } = useCartStore((state) => state);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const quantityRef = useRef<HTMLSelectElement>(null);
  const userWishlistProductIdArr = userWishlist?.map((product) => product?.id);
  const router = useRouter();

  const handleViewCart = () => {
    router.push('/cart');
    toast.dismiss();
  };

  const handleAddToCart = () => {
    if (!product) return toast.error('Oops! Something went wrong.');
    if (!quantityRef.current) return;

    const units = product?.units;
    const quantity = Number(quantityRef.current.value);
    const currProduct = cartItems[productId];

    if (units <= 0) {
      return toast.error(
        'Oops! This product is out of stock. Please check back later.'
      );
    }

    if (currProduct?.quantity + quantity > 10) {
      return toast.error(
        'Sorry, you can only add up to 10 of this product to your cart.'
      );
    }

    if (currProduct?.quantity + quantity > units) {
      return toast.error(
        "Sorry, you can't add more of this product to your cart. It exceeds the available stock."
      );
    }

    addItemToCart({
      id: productId,
      quantity,
      product: product,
    });

    toast(
      () => (
        <Notification
          firstClickHanlder={{
            handler: handleViewCart,
            buttonLabel: 'View Cart',
          }}
          notificationText="Added to cart!"
        />
      ),
      {
        position: 'top-right',
      }
    );
  };

  const handleAddToWishlist = async (session: Session | null) => {
    if (!session) {
      setIsModalOpen(true);
      return;
    }

    if (session?.user.role && session?.user.role !== 'user') {
      return toast.error('Admin cannot add products to wishlist');
    }

    if (userWishlistProductIdArr?.includes(productId)) {
      const result = await removeProductFromWishlist(
        productId,
        session?.user?.id
      );
      return result?.success === false ? toast.error(result?.message) : null;
    } else {
      const result = await addToUserWishlist(productId, session?.user?.id);
      return result?.success === false ? toast.error(result?.message) : null;
    }
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          title="Sign In to Add Products to Your Wishlist"
          description="Please sign in first in order to save products to your wishlist."
          buttonText="Go to Sign In"
          svgIcon={
            <ExclamationTriangleIcon
              className="h-6 w-6 text-yellow-500"
              aria-hidden="true"
            />
          }
          iconBgColor="bg-yellow-100"
          buttonAction={async () => {
            const { signIn } = await import('next-auth/react');
            signIn();
          }}
        />
      )}
      <form className="mt-6">
        <div className="mt-10 flex">
          <div className="flex mr-4">
            <label htmlFor={`quantity-${productId}`} className="sr-only">
              Quantity, {product?.name}
            </label>
            <select
              id={`quantity-${productId}`}
              name={`quantity-${product?.name}`}
              ref={quantityRef}
              className="max-w-full rounded-md border border-gray-300 py-1.5 text-center text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
              data-cy="quantity-select"
            >
              {[...Array(10)].map((_, i) => {
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
          </div>
          <Button
            type="button"
            className={cn(
              'flex max-w-xs flex-1 items-center justify-center border border-transparent px-8 py-3 text-base font-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full',
              product?.units === 0
                ? 'bg-gray-200 focus:ring-gray-200 hover:bg-gray-200 cursor-not-allowed'
                : ''
            )}
            onClick={handleAddToCart}
            data-cy="product-add-to-cart"
          >
            {product?.units === 0 ? 'Out of stock' : 'Add to cart'}
          </Button>

          <Button
            type="button"
            className="ml-4 flex items-center justify-center px-3 py-3 text-secondary-400 bg-transparent shadow-none hover:bg-gray-100 hover:text-secondary-500 transition-transform transform hover:scale-90"
            onClick={() => {
              handleAddToWishlist(session);
            }}
            title="Add Products to Wishlist"
            data-cy="product-add-to-wishlist"
          >
            {userWishlistProductIdArr?.includes(productId) ? (
              <HeartIconSolid
                className="h-6 w-6 flex-shrink-0"
                aria-hidden="true"
              />
            ) : (
              <HeartIcon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
            )}
            <span className="sr-only">Add to Wishlist</span>
          </Button>
        </div>
      </form>
    </>
  );
}
