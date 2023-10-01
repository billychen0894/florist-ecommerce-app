'use client';
import { ProductList } from '@components/Product';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useSession } from '@node_modules/next-auth/react';
import React, { useEffect, useState } from 'react';
import { fetchUserWishlistById } from '@store/features/userSlice';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import Button from '@components/ui/Button';

export default function Wishlist() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.userReducer.wishlist);
  const axiosWithAuth = useAxiosWithAuth();
  const [isEditToggle, setisEditToggle] = useState<boolean>(false);

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

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 ">
      <div className="flex flex-row-reverse my-6">
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
      </div>
      <section className="my-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
        {wishlist.length > 0 ? (
          <ProductList
            productsList={wishlist}
            showCategory
            isWishlistBtnToggle={isEditToggle}
          />
        ) : (
          <p className="text-gray-500 text-sm col-span-full text-center my-4">
            Currently, there are no products added to your wishlist.
          </p>
        )}
      </section>
    </main>
  );
}
