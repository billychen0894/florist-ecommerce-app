import ProductListSkeleton from '@components/Product/ProductListSkeleton';

export default function WishlistLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 ">
      <ProductListSkeleton length={8} />;
    </main>
  );
}
