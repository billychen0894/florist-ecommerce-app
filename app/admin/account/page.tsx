'use client';

import PersonalInfoForm from '@components/User/PersonalInfoForm';
import Modal from '@components/ui/Modal';
import React, { useState } from 'react';
import Button from '@components/ui/Button';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { admin } from '@lib/api/admin';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import { signOut, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { redirect } from '@node_modules/next/navigation';

export default function Account() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const axiosWithAuth = useAxiosWithAuth();
  const { data: session, status } = useSession();

  if (session?.user.role !== 'admin' && status === 'unauthenticated') {
    redirect('/denied');
  }

  const modalBtns = (
    <Button
      type="button"
      className="mt-2 bg-red-500 ext-white hover:bg-red-400 inline-flex w-full justify-center px-3 py-2"
      onClick={async () => {
        if (session && session.user.role === 'admin') {
          const loadingToastId = toast.loading('Deleting account!');
          const response = await admin.deleteUserById(
            session.user.id,
            axiosWithAuth
          );

          if (response.status === 200) {
            toast.dismiss(loadingToastId);
            toast.success('Account is removed. Redirecting...');
            setTimeout(async () => {
              await signOut();
            }, 2000);
          }
        }
      }}
    >
      Deactivate
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
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-800">
              Personal Information
            </h2>
          </div>
          <PersonalInfoForm isInputsDisabled={false} />
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-700">
              Delete account
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              No longer want to use this account? You can delete your account
              here. This action is not reversible. All information related to
              this account will be deleted permanently.
            </p>
          </div>

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
        </div>
      </div>
    </>
  );
}
