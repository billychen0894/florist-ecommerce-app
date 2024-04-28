import { fetchProducts } from '@/actions/productsActions';
import { ProductItem } from './ProductItem';

export default async function PopularProducts() {
  const products = await fetchProducts('1', 9, 'popular');

  return (
    <div className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-8">
      {products?.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          showCategory={false}
          isWishlistBtnToggle={false}
        />
      ))}
    </div>
  );
}
