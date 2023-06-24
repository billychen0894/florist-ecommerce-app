import { Product } from '@const/products';
import { ProductItem } from './ProductItem';

interface ProductListProps {
  productsList: Product[];
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
