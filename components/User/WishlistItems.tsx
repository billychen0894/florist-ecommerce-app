import { ProductItem } from '@components/Product/ProductItem';
import { TProduct } from '@lib/types/api';
import React from 'react';

interface ProductListProps {
  productsList: TProduct[];
  showCategory?: boolean;
  isWishlistBtnToggle?: boolean;
}

export default function WishlistItems({
  productsList,
  showCategory = false,
  isWishlistBtnToggle,
}: ProductListProps) {
  return (
    <>
      {productsList.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          showCategory={showCategory}
          isWishlistBtnToggle={isWishlistBtnToggle}
        />
      ))}
    </>
  );
}
