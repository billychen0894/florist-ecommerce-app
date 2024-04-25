import { TProducts } from '@lib/types/types';
import AdminProductListItem from './AdminProductListItem';
import AdminList from '@components/Admin/AdminList';

type AdminProductProps = {
  products: TProducts;
};

export default function AdminProduct({ products }: AdminProductProps) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8">
      <AdminList
        list={products?.map((product) => (
          <AdminProductListItem key={product.id} product={product} />
        ))}
        btnLabel="Add Product"
        btnUrl="/admin/products/new-product"
        isSearch
      />
    </div>
  );
}
