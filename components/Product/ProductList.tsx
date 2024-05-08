import { TProducts } from '@/lib/types/types';
import { ProductItem } from './ProductItem';

interface ProductListProps {
  showCategory?: boolean;
  isWishlistBtnToggle?: boolean;
  page?: string;
  limit: number;
  sort?: string;
  keyword?: string;
  category?: string | string[];
  products?: TProducts;
}

export function ProductList({
  showCategory = false,
  isWishlistBtnToggle,
  page,
  limit,
  products,
}: ProductListProps) {
  const skip = page ? (Number(page) - 1) * limit : 0;
  const productsList = products?.slice(skip, page ? skip + limit : 12);

  return (
    <>
      {productsList?.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          showCategory={showCategory}
          isWishlistBtnToggle={isWishlistBtnToggle}
        />
      ))}
      {!productsList ||
        (productsList.length === 0 && (
          <p className="text-sm text-gray-400 col-span-full text-center">
            No products found.
          </p>
        ))}
    </>
  );
}
