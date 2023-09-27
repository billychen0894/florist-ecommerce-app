import { TProduct } from '@lib/types/api';
import { ProductItem } from './ProductItem';
import React from 'react';

interface ProductListProps {
  productsList: TProduct[];
  showCategory?: boolean;
  isWishlistBtnToggle?: boolean;
}

export function ProductList({
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
