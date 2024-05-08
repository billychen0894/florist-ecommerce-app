import { ProductItem } from '@/components/Product/ProductItem';
import { TWishlist } from '@/lib/types/types';

interface ProductListProps {
  productsList: TWishlist;
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
      {productsList?.map((product) => (
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
