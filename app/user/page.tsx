'use client';

import Button from '@components/ui/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import { users } from '@lib/api/users';
import { User } from '@lib/types/api';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

const inputNameFormSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
});

type FormData = yup.InferType<typeof inputNameFormSchema>;

export default function User() {
  const methods = useForm<FormData>({
    resolver: yupResolver(inputNameFormSchema),
    defaultValues: {
      name: '',
    },
  });
  const [userInfo, setUserInfo] = useState<User>();
  const { data: session } = useSession();
  const axiosWithAuth = useAxiosWithAuth();

  const getUser = async () => {
    const response = users.getUser(session?.user?.id, axiosWithAuth);
    const data = await response;
    setUserInfo(data.data);
  };

  const onSubmit = (data: FormData) => {
    users.updateUser(data, session?.user?.id, axiosWithAuth);
  };

  return (
    <div className="flex justify-center items-center w-full h-full space-x-10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...methods.register('name')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter your name"
            />
          </div>
          <Button type="submit">Update User Name</Button>
        </form>
        <div>
          <Button type="button" onClick={getUser}>
            Fetch User
          </Button>
          {userInfo && (
            <p className="max-w-lg h-auto mt-4 break-words">
              {JSON.stringify(userInfo)}
            </p>
          )}
        </div>
      </FormProvider>
    </div>
  );
}
