'use client';

import { deleteProductById } from '@/actions/adminActions';
import CategoriesSection from '@/components/Admin/CategoriesSection';
import ImageUploadSection from '@/components/Admin/ImageUploadSection';
import ProductDetailSection from '@/components/Admin/ProductDetailSection';
import { Input, Label } from '@/components/ui';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { Textarea } from '@/components/ui/Textarea';
import {
  onSubmitNewProductForm,
  onSubmitProductDetailsForm,
} from '@/lib/formActions';
import {
  ProductDetailsFormSchema,
  productDetailsFormSchema,
} from '@/lib/schemaValidator';
import { TProduct } from '@/lib/types/types';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type AdminProductDetailsForm = {
  categories: Category[] | null;
  selectedProduct?: TProduct;
  mode: 'edit' | 'create';
};

export default function AdminProductDetailsForm({
  categories,
  selectedProduct,
  mode,
}: AdminProductDetailsForm) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const selectedProductCategories = selectedProduct?.categories.map(
    (category) => ({ name: category.name })
  );
  const selectedProductDetailItems =
    selectedProduct?.productDetail?.productDetailItems.map((item) => ({
      productDetailItemName: item.productDetailItemName,
      items: item.items,
    }));

  const methods = useForm<ProductDetailsFormSchema>({
    resolver: zodResolver(productDetailsFormSchema),
    defaultValues: {
      name: selectedProduct?.name || '',
      description: selectedProduct?.description || '',
      price: selectedProduct?.price || 0,
      images: {
        existingImages:
          mode === 'edit'
            ? selectedProduct?.images?.map((image) => ({
                url: image.url,
                publicId: image.publicId,
              }))
            : [],
        newImages: [],
      },
      categories: selectedProductCategories || [],
      units: selectedProduct?.units || 1,
      inStock: mode === 'edit' ? selectedProduct?.inStock : true,
      leadTime: selectedProduct?.leadTime || '',
      productDetail: {
        productDetailItems: selectedProductDetailItems || [],
      },
      selectedProductId: mode === 'edit' ? selectedProduct?.id : 'newProduct',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    control,
    watch,
  } = methods;

  const onSubmit = async (data: ProductDetailsFormSchema) => {
    const isImagesDirty =
      data?.images?.newImages?.length > 0 ||
      data?.images?.existingImages?.length !== selectedProduct?.images?.length;
    if (mode === 'edit' && !isDirty && !isImagesDirty) {
      toast.error('Please make some changes before submitting');
      return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('units', data.units.toString());
    formData.append('inStock', data.inStock.toString());
    formData.append('leadTime', data.leadTime);
    formData.append('categories', JSON.stringify(data.categories));
    formData.append('productDetail', JSON.stringify(data.productDetail));
    formData.append('selectedProductId', selectedProduct?.id || '');
    formData.append(
      'existingImages',
      JSON.stringify(mode === 'edit' ? data.images.existingImages : [])
    );
    for (let i = 0; i < data.images.newImages.length; i++) {
      formData.append('newImages[]', data.images.newImages[i]);
    }

    try {
      const result =
        mode === 'edit'
          ? await onSubmitProductDetailsForm(formData)
          : await onSubmitNewProductForm(formData);

      if (!result?.success) {
        return toast.error(result?.message);
      }

      toast.success(result?.message);
      mode === 'create' ? router.push('/admin/products') : null;
    } catch (err) {
      console.error('Error during saving product info: ', err);
      return toast.error('Something went wrong');
    }
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title="Are you sure you want to delete this product?"
        description="Delete operation cannot be undone! Any data related to this product will also be deleted!"
        buttonText={
          <div className="flex justify-center items-center">
            {isLoading && <Spinner />}
            <span className="inline-block">Delete</span>
          </div>
        }
        svgIcon={
          <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
        }
        iconBgColor="bg-yellow-100"
        buttonAction={async () => {
          setIsModalOpen(true);
          try {
            setIsLoading(true);
            if (selectedProduct) {
              const result = await deleteProductById(selectedProduct.id);
              if (result?.success) {
                toast.success('Product is successfully deleted');
                setIsLoading(false);
                setIsModalOpen(false);
                router.push('/admin/products');
              } else {
                toast.error('Something went wrong during deleting product');
                setIsLoading(false);
              }
            }
          } catch (err: any) {
            setIsLoading(false);
            toast.error(
              err?.response?.data?.message ||
                'Something went wrong during deleting product'
            );
            console.error('Error while deleting product:', err.message);
          }
        }}
        additionalBtns={
          <Button
            type="button"
            onClick={() => {
              setIsModalOpen(false);
            }}
            className="inline-flex w-full px-3 py-2 justify-center mt-2 bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </Button>
        }
      />
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
        >
          <div className="px-4 py-6 sm:p-8 flex justify-center">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-full">
                <Label htmlFor="name">Product name</Label>
                <div className="mt-2">
                  <Input id="name" type="text" {...register('name')} />
                </div>
                <ErrorMessage
                  name="name"
                  errors={errors}
                  as="p"
                  className="text-xs font-medium text-red-500 mt-1 ml-1"
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="price">Price</Label>
                <div className="mt-2">
                  <Input id="price" type="text" {...register('price')} />
                </div>
                <ErrorMessage
                  name="price"
                  errors={errors}
                  as="p"
                  className="text-xs font-medium text-red-500 mt-1 ml-1"
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="leadTime">Lead time</Label>
                <div className="mt-2">
                  <select
                    id="leadTime"
                    {...register('leadTime')}
                    defaultValue={''}
                    className="w-full block rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <option value="" disabled>
                      Select lead time
                    </option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="2-3 weeks">2-3 weeks</option>
                    <option value="3-4 weeks">3-4 weeks</option>
                  </select>
                </div>
                <ErrorMessage
                  name="leadTime"
                  errors={errors}
                  as="p"
                  className="text-xs font-medium text-red-500 mt-1 ml-1"
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="units">Units</Label>
                <div className="mt-2">
                  <Input id="units" type="text" {...register('units')} />
                </div>
                <ErrorMessage
                  name="units"
                  errors={errors}
                  as="p"
                  className="text-xs font-medium text-red-500 mt-1 ml-1"
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="inStock">In stock</Label>
                <div className="mt-2">
                  <select
                    id="inStock"
                    {...register('inStock')}
                    value={watch('units') > 0 ? 'true' : 'false'}
                    className="w-full block rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
                    disabled
                  >
                    <option value="" disabled>
                      Is product in stock?
                    </option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
                <ErrorMessage
                  name="inStock"
                  errors={errors}
                  as="p"
                  className="text-xs font-medium text-red-500 mt-1 ml-1"
                />
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <Textarea
                    id="description"
                    placeholder="Type your product description here."
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                    defaultValue={''}
                    {...register('description')}
                  />
                </div>
                <ErrorMessage
                  name="description"
                  errors={errors}
                  as="p"
                  className="text-xs font-medium text-red-500 mt-1 ml-1"
                />
              </div>
              <ImageUploadSection />
              <CategoriesSection categories={categories} />
              <ProductDetailSection
                control={control}
                selectedProduct={selectedProduct}
                isEdit={mode === 'edit'}
              />
            </div>
          </div>
          <div
            className={`flex items-center gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8 ${
              mode === 'create' ? 'justify-end' : 'justify-between'
            }`}
          >
            {mode === 'edit' ? (
              <Button
                type="button"
                disabled={isSubmitting}
                className="disabled:bg-gray-300 disabled:cursor-not-allowed bg-red-500 hover:bg-red-400"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <div className="flex justify-center items-center">
                  <span>Delete</span>
                </div>
              </Button>
            ) : null}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <div className="flex justify-end items-center">
                {isSubmitting && <Spinner />}
                <span>{mode === 'edit' ? 'Save' : 'Create'}</span>
              </div>
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
