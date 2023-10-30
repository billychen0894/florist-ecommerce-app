'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, Label } from '@components/ui';
import { ErrorMessage } from '@hookform/error-message';
import Button from '@components/ui/Button';
import toast from 'react-hot-toast';
import Spinner from '@components/ui/Spinner';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { admin } from '@lib/api/admin';

const defaultCategoryFormSchema = yup.object().shape({
  name: yup
    .string()
    .max(30, 'Category name cannot excceed 30 characters')
    .trim()
    .required('Category name is required'),
});

type CategoryFormSchema = yup.InferType<typeof defaultCategoryFormSchema>;

export default function NewCategory() {
  const axiosWithAuth = useAxiosWithAuth();
  const router = useRouter();
  const methods = useForm<CategoryFormSchema>({
    resolver: yupResolver(defaultCategoryFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: CategoryFormSchema) => {
    try {
      const response = await admin.createCategory(data?.name, axiosWithAuth);

      if (response.status === 201) {
        toast.success('New category is successfully created');
        setTimeout(() => {
          router.push('/admin/categories');
        }, 1000);
        return;
      } else {
        toast.error('Something went wrong while adding new categories');
        return;
      }
    } catch (err: any) {
      console.error('Error during adding new categories: ', err.message);
      return toast.error(
        err?.response?.data?.message ||
          'Something went wrong during adding new categories'
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-white shadow-sm"
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
            <div className="col-span-full">
              <Label htmlFor="name">Category name</Label>
              <div className="mt-2">
                <Input
                  id="name"
                  type="text"
                  {...register('name')}
                  placeholder="Add category..."
                  className="max-w-md placeholder:text-gray-400 placeholder:text-xs"
                />
              </div>
              <ErrorMessage
                name="name"
                errors={errors}
                as="p"
                className="text-xs font-medium text-red-500 mt-1 ml-1"
              />
            </div>
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
              <span>Add</span>
            </div>
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
