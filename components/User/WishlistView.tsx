'use client';

import Button from '@components/ui/Button';
import { TWishlist } from '@lib/types/types';
import { useState } from 'react';
import WishlistItems from './WishlistItems';

export type WishlistProps = {
  wishlist: TWishlist;
};

export default function WishlistView({ wishlist }: WishlistProps) {
  const [isEditToggle, setisEditToggle] = useState<boolean>(false);

  if (!wishlist || wishlist?.length === 0) {
    return (
      <section className="my-6 min-h-screen grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
        <p className="text-gray-500 text-sm col-span-full text-center my-4">
          Currently, there are no products added to your wishlist.
        </p>
      </section>
    );
  }

  return (
    <>
      <div className="flex flex-row-reverse my-6">
        {wishlist?.length > 0 && (
          <Button
            type="button"
            className={`w-16 h-10 ${
              !isEditToggle
                ? 'bg-primary-500 hover:bg-primary-400'
                : 'bg-secondary-500 hover:bg-secondary-400'
            }`}
            onClick={() => {
              setisEditToggle(!isEditToggle);
            }}
          >
            {isEditToggle ? 'Done' : 'Edit'}
          </Button>
        )}
      </div>
      <section className="my-6 min-h-screen grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
        <WishlistItems
          productsList={wishlist}
          showCategory
          isWishlistBtnToggle={isEditToggle}
        />
      </section>
    </>
  );
}
