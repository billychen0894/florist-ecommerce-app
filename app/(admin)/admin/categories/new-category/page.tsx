'use client';

import { useForm } from 'react-hook-form';
import { Input, Label } from '@components/ui';
import { ErrorMessage } from '@hookform/error-message';
import Button from '@components/ui/Button';
import toast from 'react-hot-toast';
import Spinner from '@components/ui/Spinner';
import { useRouter } from 'next/navigation';
import { CategoryFormSchema, categoryFormSchema } from '@lib/schemaValidator';
import { zodResolver } from '@hookform/resolvers/zod';
import { onSubmitCategoryForm } from '@lib/formActions';

export default function NewCategory() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: CategoryFormSchema) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);

      const result = await onSubmitCategoryForm(formData);

      if (!result?.success) {
        toast.error('Something went wrong during adding category');
        return;
      }

      toast.success('Category is successfully added');
      router.push('/admin/categories');
    } catch (err: any) {
      console.error('Error while adding category:', err);
      toast.error('Something went wrong during adding category');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white shadow-sm"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          Add Category
        </h1>
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
  );
}
