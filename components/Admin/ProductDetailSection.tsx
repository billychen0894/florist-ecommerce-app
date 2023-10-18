import {
  MinusCircleIcon,
  PlusCircleIcon,
} from '@node_modules/@heroicons/react/20/solid';
import { cn } from '@lib/classNames';
import { ErrorMessage } from '@node_modules/@hookform/error-message';
import { Control, useFieldArray } from '@node_modules/react-hook-form';
import { useFormContext } from 'react-hook-form';
import { ProductDetailsFormSchema } from '@components/Admin/ProductDetailsFormValidation';
import { Input } from '@components/ui';
import { TProduct } from '@lib/types/api';
import { useEffect } from 'react';

type ProductDetailSection = {
  control: Control<ProductDetailsFormSchema>;
  selectedProduct: TProduct;
};
export default function ProductDetailSection({
  control,
  selectedProduct,
}: ProductDetailSection) {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove, replace } = useFieldArray({
    name: 'productDetail.productDetailItems',
    control,
  });

  useEffect(() => {
    if (selectedProduct.id) {
      const existingProductDetailItems =
        selectedProduct.productDetail.productDetailItems.map((item) => ({
          productDetailItemName: item.productDetailItemName,
          items: item.items,
        }));
      if (existingProductDetailItems.length > 0) {
        replace(existingProductDetailItems);
      }
    }
  }, [
    replace,
    selectedProduct.productDetail.productDetailItems,
    selectedProduct,
  ]);

  return (
    <div className="col-span-full">
      <h3 className="col-span-full font-medium leading-6 text-sm text-gray-900">
        Product detail
      </h3>
      <div className="flex items-center gap-1">
        <h3 className="text-xs text-gray-400 leading-6">
          Add product details for each item
        </h3>
        <PlusCircleIcon
          onClick={() => {
            const productDetailItems = getValues(
              'productDetail.productDetailItems'
            );
            if (productDetailItems.length >= 3) {
              return;
            } else {
              append([
                {
                  productDetailItemName: 'Product',
                  items: ['', '', '', '', ''],
                },
                {
                  productDetailItemName: 'Care',
                  items: ['', '', '', '', ''],
                },
                {
                  productDetailItemName: 'Delivery',
                  items: ['', '', '', '', ''],
                },
              ]);
            }
          }}
          className={cn(
            'h-6 w-6 text-blue-500 hover:text-blue-400 cursor-pointer',
            getValues('productDetail.productDetailItems').length >= 3
              ? 'text-gray-400 hover:text-gray-300 cursor-not-allowed'
              : ''
          )}
        >
          Add
        </PlusCircleIcon>
        <MinusCircleIcon
          onClick={() => {
            remove();
          }}
          className={cn(
            'w-6 h-6 text-red-500 hover:text-red-400 cursor-pointer',
            getValues('productDetail.productDetailItems').length < 3
              ? 'text-gray-400 hover:text-gray-300 cursor-not-allowed'
              : ''
          )}
        >
          Remove
        </MinusCircleIcon>
      </div>
      <ErrorMessage
        name="productDetail.productDetailItems"
        errors={errors}
        as="p"
        className="text-xs font-medium text-red-500 mt-1 ml-1"
      />
      {fields.map((field, index) => {
        return (
          <section
            key={field.id}
            className="flex justify-center items-start gap-2 mt-3"
          >
            <select
              className="max-w-[8rem] max-h-[2.5rem] block rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
              {...register(
                `productDetail.productDetailItems.${index}.productDetailItemName` as const
              )}
              disabled
              defaultValue={field.productDetailItemName}
            >
              <option value="">Select a product detail name</option>
              <option value="Product">Product</option>
              <option value="Care">Care</option>
              <option value="Delivery">Delivery</option>
            </select>
            <div className="w-full flex justify-center items-center gap-1 flex-wrap">
              {field.items.map((_, subIndex) => {
                return (
                  <Input
                    key={subIndex}
                    type="text"
                    placeholder="Add details..."
                    {...register(
                      `productDetail.productDetailItems.${index}.items.${subIndex}` as const
                    )}
                    className="w-full placeholder:text-xs placeholder:text-gray-300"
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
