import { ProductItem as TProductItem } from '@lib/types/types';
import { ProductItem } from './ProductItem';

interface ProductListProps {
  productsList: TProductItem[];
  showCategory?: boolean;
}

export function ProductList({
  productsList,
  showCategory = false,
}: ProductListProps) {
  return (
    <>
      {productsList.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          showCategory={showCategory}
        />
      ))}
    </>
  );
}
