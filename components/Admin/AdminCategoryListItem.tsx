'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@prisma/client';
import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/20/solid';
import Modal from '@components/ui/Modal';
import { useState } from 'react';
import Button from '@components/ui/Button';
import { admin } from '@lib/api/admin';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import Spinner from '@components/ui/Spinner';
import toast from 'react-hot-toast';
import getQueryClient from '@lib/getQueryClient';

interface AdminCategoryListItem {
  category: Category;
  selectedCategory: Category | undefined;
}
export default function AdminCategoryListItem({
  category,
  selectedCategory,
}: AdminCategoryListItem) {
  const router = useRouter();
  const pathname = usePathname();
  const categoryId = useSearchParams().get('categoryId');
  const [open, setOpen] = useState<boolean>(false);
  const axiosWithAuth = useAxiosWithAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = getQueryClient();

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
            if (selectedCategory) {
              const response = await admin.deleteCategoryById(
                selectedCategory?.id,
                axiosWithAuth
              );
              if (response.status === 200) {
                toast.success('Category is successfully deleted');
                setIsLoading(false);
                setTimeout(() => {
                  setOpen(false);
                  queryClient.invalidateQueries({ queryKey: ['category'] });
                  if (window !== undefined) {
                    window.location.reload();
                  }
                }, 1500);
              } else {
                toast.error('Something went wrong during deleting category');
                setIsLoading(false);
              }
            }
          } catch (err: any) {
            setIsLoading(false);
            toast.error(
              err?.response?.data?.message ||
                'Something went wrong during deleting category'
            );
            console.error('Error while deleting category:', err.message);
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
        className={`flex gap-x-4 px-3 py-5 hover:bg-primary-100 cursor-pointer ${
          categoryId === category.id ? 'bg-primary-200' : ''
        }`}
        data-categoryid={category.id}
        onClick={(e) => {
          const params = new URLSearchParams(window.location.search);
          if (params.has('categoryId') && e.currentTarget.dataset.categoryid) {
            params.delete('categoryId');
            params.append('categoryId', e.currentTarget.dataset.categoryid);
          } else if (
            !params.has('categoryId') &&
            e.currentTarget.dataset.categoryid
          ) {
            params.append('categoryId', e.currentTarget.dataset.categoryid);
          }
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }}
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
