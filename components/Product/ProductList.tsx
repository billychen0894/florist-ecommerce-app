import { TProduct } from '@lib/types/api';
import { ProductItem } from './ProductItem';

interface ProductListProps {
  productsList: TProduct[];
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
