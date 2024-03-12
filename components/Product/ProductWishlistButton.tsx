'use client';

import Button from '@components/ui/Button';
import { users } from '@lib/api/users';
import { removeProductsFromWishlist } from '@store/features/userSlice';
import { HeartIcon as HeartIconSolid } from '@node_modules/@heroicons/react/24/solid';
import React from 'react';
import { useAppDispatch } from '@store/hooks';
import { useSession } from '@node_modules/next-auth/react';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import { TProduct } from '@actions/fetch-products';

type ProductWishlistButtonProps = {
  product: TProduct;
};

export default function ProductWishlistButton({
  product,
}: ProductWishlistButtonProps) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const axiosWithAuth = useAxiosWithAuth();

  return (
    <div className="relative z-10">
      <Button
        type="button"
        className="absolute top-0 right-0 ml-4 flex items-center justify-center px-3 py-3 text-secondary-400 bg-transparent hover:bg-transparent shadow-none hover:text-secondary-500 transition-transform transform hover:scale-90"
        title="Add Products to Wishlist"
        onClick={() => {
          if (session?.user && product) {
            users.deleteProductFromWishlist(
              product.id,
              session?.user.id,
              axiosWithAuth
            );
            dispatch(removeProductsFromWishlist(product));
          }
        }}
      >
        <HeartIconSolid className="h-8 w-8 flex-shrink-0" aria-hidden="true" />
        <span className="sr-only">Add to Wishlist</span>
      </Button>
    </div>
  );
}
