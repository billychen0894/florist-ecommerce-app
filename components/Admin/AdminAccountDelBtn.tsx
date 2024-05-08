'use client';

import { deleteUserById } from '@/actions/adminActions';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { UserWithoutPass } from '@/lib/types/types';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import toast from 'react-hot-toast';

type AdminAccountDelBtnProps = {
  user: UserWithoutPass | null;
};

export default function AdminAccountDelBtn({ user }: AdminAccountDelBtnProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const modalBtns = (
    <Button
      type="button"
      className="mt-2 bg-red-500 ext-white hover:bg-red-400 inline-flex w-full justify-center px-3 py-2"
      onClick={async () => {
        if (user) {
          const loadingToastId = toast.loading('Deleting account!');
          const result = await deleteUserById(user.id);

          if (result?.success) {
            toast.dismiss(loadingToastId);
            toast.success('Account is removed. Redirecting...');
            setTimeout(async () => {
              const { signOut } = await import('next-auth/react');
              signOut();
            }, 2000);
          }
        }
      }}
    >
      Delete my account
    </Button>
  );

  return (
    <>
      <Modal
        open={isOpen}
        setOpen={setIsOpen}
        title="Deactivate account"
        iconBgColor="bg-red-200"
        svgIcon={<ExclamationTriangleIcon className="text-red-400 h-10 w-10" />}
        description="Are you sure you want to deactivate your account? All of your data will be permanently removed from our servers forever. This action cannot be undone."
        buttonText="Cancel"
        backdropAction={() => {
          setIsOpen(false);
        }}
        additionalBtns={modalBtns}
      />
      <form className="flex items-start md:col-span-2">
        <Button
          type="button"
          className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Yes, delete my account
        </Button>
      </form>
    </>
  );
}
