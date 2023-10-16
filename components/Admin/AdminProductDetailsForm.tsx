'use client';

import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import {
  defaultProductDetailsFromSchema,
  ProductDetailsFormSchema,
} from '@components/Admin/ProductDetailsFormValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, Label } from '@components/ui';
import { ErrorMessage } from '@hookform/error-message';
import { Textarea } from '@components/ui/Textarea';
import Button from '@components/ui/Button';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import ImageUploadSection from '@components/Admin/ImageUploadSection';
import CategoriesSection from '@components/Admin/CategoriesSection';
import { Category } from '@prisma/client';
import { cn } from '@lib/classNames';

type AdminProductDetailsForm = {
  categories: Category[];
};

export default function AdminProductDetailsForm({
  categories,
}: AdminProductDetailsForm) {
  // TODO: fetch selected images as default state
  const [images, setImages] = useState<{
    existingImages: string[];
    newImages: File[];
  }>({
    existingImages: [
      '/images/products/product1.jpg',
      '/images/products/product2.jpg',
    ],
    newImages: [],
  });
  const [selectedCategories, setSelectedCategories] = useState<
    { name: string }[]
  >([{ name: 'Plants' }]);
  const methods = useForm<ProductDetailsFormSchema>({
    resolver: yupResolver(defaultProductDetailsFromSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      images: { existingImages: images.existingImages, newImages: [] },
      categories: selectedCategories,
      units: 1,
      inStock: true,
      leadTime: '',
      productDetail: {
        productDetailItems: [],
      },
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    getValues,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    name: 'productDetail.productDetailItems',
    control,
  });

  const onSubmit = (data: ProductDetailsFormSchema) => {
    // Get image files from `data` and upload to Cloudinary server
    // Need to think of Cloudinary server storage management technique
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full hidden sm:block bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
      >
        <div className="px-4 py-6 sm:p-8">
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
            <ImageUploadSection images={images} setImages={setImages} />
            <CategoriesSection
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
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
                      append({
                        productDetailItemName: '',
                        items: ['', '', ''],
                      });
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
                    className="flex justify-center items-center gap-1 mt-2"
                  >
                    <select
                      key={field.id}
                      className="max-w-[8rem] block rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
                      {...register(
                        `productDetail.productDetailItems.${index}.productDetailItemName`
                      )}
                    >
                      <option value="">Select a product detail name</option>
                      <option value="Product">Product</option>
                      <option value="Care">Care</option>
                      <option value="Delivery">Delivery</option>
                    </select>
                    <div className="flex justify-center items-center gap-1">
                      {field.items.map((subField, subIndex) => {
                        return (
                          <Input
                            key={subIndex}
                            type="text"
                            {...register(
                              `productDetail.productDetailItems.${index}.items.${subIndex}`
                            )}
                          />
                        );
                      })}
                      <MinusCircleIcon
                        onClick={() => {
                          remove(index);
                        }}
                        className="w-20 text-red-500 hover:text-red-400 cursor-pointer"
                      >
                        Remove
                      </MinusCircleIcon>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </FormProvider>
  );
}
