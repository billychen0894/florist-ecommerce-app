'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Session } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import Notification from '@components/ui/Notification';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import { users } from '@lib/api/users';
import { TProduct } from '@lib/types/api';
import { addItemToCart } from '@store/features/cartSlice';
import {
  addProductsToWishlist,
  fetchUserWishlistById,
  removeProductsFromWishlist,
} from '@store/features/userSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

interface ProductActionsProps {
  productId: string;
  product: TProduct | null;
}

export function ProductActions({ productId, product }: ProductActionsProps) {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const quantityRef = useRef<HTMLSelectElement>(null);
  const dispatch = useAppDispatch();
  const userWishlist = useAppSelector((state) => state.userReducer.wishlist);
  const userWishlistProductIdArr = userWishlist.map((product) => product.id);
  const axiosWithAuth = useAxiosWithAuth();
  const router = useRouter();

  useEffect(() => {
    if (session?.user.id) {
      dispatch(
        fetchUserWishlistById({
          userId: session?.user.id,
          axiosWithAuth: axiosWithAuth,
        })
      );
    }
  }, [dispatch, session?.user.id, axiosWithAuth]);

  const handleViewCart = () => {
    router.push('/cart');
    toast.dismiss();
  };

  const handleAddToCart = () => {
    const dispatchPayload = {
      id: productId,
      quantity: quantityRef.current?.value
        ? Number(quantityRef.current.value)
        : 0,
      product: product as TProduct,
    };
    dispatch(addItemToCart(dispatchPayload));

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

  const handleAddToWishlist = (session: Session | null) => {
    if (!session) {
      setIsModalOpen(true);
    } else {
      if (session?.user.role && session?.user.role !== 'user')
        return toast.error('Admin cannot add products to wishlist');

      setIsModalOpen(false);
      if (userWishlistProductIdArr.includes(productId) && product) {
        users.deleteProductFromWishlist(
          productId,
          session?.user.id,
          axiosWithAuth
        );
        dispatch(removeProductsFromWishlist(product as TProduct));
      } else {
        users.addToUserWishlist(productId, session?.user.id, axiosWithAuth);
        dispatch(addProductsToWishlist(product as TProduct));
      }
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
          buttonAction={() => {
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
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="button"
            className="flex max-w-xs flex-1 items-center justify-center border border-transparent px-8 py-3 text-base font-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>

          <Button
            type="button"
            className="ml-4 flex items-center justify-center px-3 py-3 text-secondary-400 bg-transparent shadow-none hover:bg-gray-100 hover:text-secondary-500 transition-transform transform hover:scale-90"
            onClick={() => {
              handleAddToWishlist(session);
            }}
            title="Add Products to Wishlist"
          >
            {userWishlistProductIdArr.includes(productId) ? (
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
