import { Label } from '@components/ui';
import Button from '@components/ui/Button';
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';
import ContextMenu from '@components/ui/ContextMenu';
import { Category } from '@prisma/client';
import { useRef } from 'react';

type CategoriesSection = {
  categories: Category[];
};

export default function CategoriesSection({ categories }: CategoriesSection) {
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const {
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useFormContext();

  const currentCategories: { name: string }[] = getValues('categories');

  return (
    <div className="col-span-full">
      <Controller
        name="categories"
        control={control}
        render={({ field }) => (
          <>
            <Label
              htmlFor="categories"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Categories
            </Label>
            <div className="flex items-center gap-1 mt-2">
              <select
                ref={selectRef}
                className="flex-shrink-0 block rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
                defaultValue=""
              >
                <option value="" disabled>
                  Select categories
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                className="max-w-md w-40 py-1.5 bg-transparent hover:bg-gray-100 text-gray-500 font-normal border border-gray-300"
                onClick={() => {
                  if (selectRef.current && selectRef.current?.value) {
                    const isCateogrySelected = currentCategories.some(
                      (category) => category.name === selectRef.current?.value
                    );
                    const updatedSelectedCategory = isCateogrySelected
                      ? currentCategories
                      : [
                          ...currentCategories,
                          { name: selectRef.current?.value },
                        ];

                    field.onChange(updatedSelectedCategory);

                    if (!isCateogrySelected) {
                      setValue('categories', updatedSelectedCategory, {
                        shouldValidate: true,
                      });
                      selectRef.current.value = '';
                    } else {
                      return;
                    }
                  }
                }}
              >
                <div className="flex justify-center items-center">
                  <PlusIcon className="h-6 w-6" />
                  <span>Add item</span>
                </div>
              </Button>
            </div>
            {currentCategories.length === 0 && (
              <ContextMenu>No categories</ContextMenu>
            )}
            {currentCategories.length > 0 && (
              <div className="mt-2 flex items-center rounded-lg border border-dashed border-gray-900/25 p-2 gap-2">
                {currentCategories.map((category, idx) => (
                  <div
                    key={idx}
                    className="group w-24 h-8 inline-flex justify-center items-center rounded-full bg-green-50 hover:bg-red-100 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20 hover:ring-red-600/20 cursor-pointer transition"
                    onClick={() => {
                      const updatedSelectedCategories =
                        currentCategories.filter((_, i) => idx !== i);
                      setValue('categories', updatedSelectedCategories, {
                        shouldValidate: true,
                      });
                      field.onChange(updatedSelectedCategories);
                    }}
                  >
                    <span className="group-hover:text-red-500 group-hover:hidden">
                      {category.name}
                    </span>
                    <TrashIcon className="w-6 hidden group-hover:inline-block fill-red-500" />
                  </div>
                ))}
              </div>
            )}
            <ErrorMessage
              name="categories"
              errors={errors}
              as="p"
              className="text-xs font-medium text-red-500 mt-1 ml-1"
            />
          </>
        )}
      />
    </div>
  );
}
