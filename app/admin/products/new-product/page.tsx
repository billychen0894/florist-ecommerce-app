'use client';

import { FormProvider, useForm } from 'react-hook-form';
import {
  defaultProductDetailsFromSchema,
  ProductDetailsFormSchema,
} from '@components/Admin/ProductDetailsFormValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, Label } from '@components/ui';
import { ErrorMessage } from '@hookform/error-message';
import { Textarea } from '@components/ui/Textarea';
import Button from '@components/ui/Button';
import ImageUploadSection from '@components/Admin/ImageUploadSection';
import CategoriesSection from '@components/Admin/CategoriesSection';
import ProductDetailSection from '@components/Admin/ProductDetailSection';
import toast from 'react-hot-toast';
import Spinner from '@components/ui/Spinner';
import { useAppSelector } from '@store/hooks';
import { ProductReqPayload } from '@lib/types/api';
import { multiImagesUpload } from '@actions/imageUpload';
import getQueryClient from '@lib/getQueryClient';
import { admin } from '@lib/api/admin';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import { useRouter } from 'next/navigation';

export default function New() {
  const categories = useAppSelector((state) => state.adminReducer.categories);
  const queryClient = getQueryClient();
  const axiosWithAuth = useAxiosWithAuth();
  const router = useRouter();
  const methods = useForm<ProductDetailsFormSchema>({
    resolver: yupResolver(defaultProductDetailsFromSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      images: { existingImages: [], newImages: [] },
      categories: [],
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
    formState: { errors, isSubmitting },
    watch,
    control,
  } = methods;

  const onSubmit = async (data: ProductDetailsFormSchema) => {
    try {
      const { images } = data;
      const reqPayload: ProductReqPayload = {
        ...data,
        images: {
          existingImages: [...data.images.existingImages],
          newImages: [],
        },
      };

      const newImageFilesPromises = images.newImages.map((image) => {
        return new Promise<{ imageFile: string | ArrayBuffer } | null>(
          async (resolve) => {
            try {
              const reader = new FileReader();

              reader.onload = (event) => {
                if (event.target && event.target.result) {
                  resolve({ imageFile: event.target.result });
                } else {
                  resolve(null);
                }
              };

              reader.readAsDataURL(image);
            } catch (err: any) {
              console.error('Something went wrong', err.message);
              resolve(null);
            }
          }
        );
      });

      const newImagesFilesResult = await Promise.all(newImageFilesPromises);
      const newImagesFiles = newImagesFilesResult.filter(
        (item) => item !== null
      ) as { imageFile: string | ArrayBuffer }[];

      if (newImagesFiles.length > 0) {
        const result = await multiImagesUpload(newImagesFiles);

        if (result && result?.length > 0) {
          reqPayload.images.newImages = result.filter((item) => item !== null);
        }
      }

      if (reqPayload) {
        const response = await admin.createProduct(reqPayload, axiosWithAuth);

        if (response.status === 201) {
          toast.success('Product is created successfully');
          await queryClient.invalidateQueries({ queryKey: ['query'] });
          router.push('/admin/products');
          return;
        } else {
          return toast.error('Something went wrong while creating product');
        }
      }
    } catch (err: any) {
      console.error('Error during saving product info: ', err.message);
      return toast.error('Something went wrong while creating product');
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl "
      >
        <div className="px-4 py-6 sm:p-8 flex justify-center items-center">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
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
              selectedProduct={undefined}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <div className="flex justify-center items-center">
              {isSubmitting && <Spinner />}
              <span>Create</span>
            </div>
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
