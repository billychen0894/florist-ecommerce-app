import { Category, Image, Product } from '@prisma/client';
import { ProductItem } from './ProductItem';

type ProductItem = Product & { images: Image[] } & { categories: Category[] };

interface ProductListProps {
  productsList: ProductItem[];
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
