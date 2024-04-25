'use client';

import { Category } from '@prisma/client';
import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/20/solid';
import Modal from '@components/ui/Modal';
import { useState } from 'react';
import Button from '@components/ui/Button';
import Spinner from '@components/ui/Spinner';
import toast from 'react-hot-toast';
import { deleteCategoryById } from '@actions/adminActions';

interface AdminCategoryListItem {
  category: Category;
}
export default function AdminCategoryListItem({
  category,
}: AdminCategoryListItem) {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        title="Are you sure you want to delete this category?"
        description="Delete operation cannot be undone!"
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
          setOpen(true);
          try {
            setIsLoading(true);
            if (category) {
              const result = await deleteCategoryById(category.id);
              if (result?.success) {
                toast.success('Category is successfully deleted');
                setIsLoading(false);
                setOpen(false);
              } else {
                toast.error('Something went wrong during deleting category');
                setIsLoading(false);
              }
            }
          } catch (err: any) {
            setIsLoading(false);
            toast.error('Something went wrong during deleting category');
            console.error('Error while deleting category:', err);
          }
        }}
        additionalBtns={
          <Button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
            className="inline-flex w-full px-3 py-2 justify-center mt-2 bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </Button>
        }
      />
      <li
        className="flex gap-x-4 px-3 py-5 hover:bg-primary-100 cursor-pointer"
        data-categoryid={category.id}
      >
        <div className="min-w-0 flex justify-between items-center w-full">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {category.name}
          </p>
          <div
            className="h-6 w-6 text-red-500 hover:text-gray-400 relative z-10"
            onClick={() => {
              setOpen(true);
            }}
          >
            <TrashIcon className="w-full h-full " />
          </div>
        </div>
      </li>
    </>
  );
}
