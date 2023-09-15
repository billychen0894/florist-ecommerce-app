'use client';

import { Input, Label } from '@components/ui';
import { Skeleton } from '@components/ui/Skeleton';
import { useAppSelector } from '@store/hooks';
import Image from 'next/image';

const avatarImage = (
  <svg
    className="h-24 w-24 flex-none rounded-lg border border-gray-50 shadow-sm object-cover text-gray-300"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

interface PersonalInfoFormProps {
  isInputsDisabled: boolean;
}

export default function PersonalInfoForm({
  isInputsDisabled,
}: PersonalInfoFormProps) {
  const user = useAppSelector((state) => state.userReducer.user);
  const userStripeInfo = useAppSelector(
    (state) => state.userReducer.userStripe
  );

  const skeletonLoadingUI = (
    <Skeleton className="md:col-span-2">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-full flex items-center gap-x-8">
          <div className="h-24 w-24 flex-none rounded-lg shadow-sm bg-slate-200" />
        </div>
        <div className="sm:col-span-3">
          <div className="h-6 max-w-[6rem] bg-slate-200 rounded-lg" />
          <div className="mt-2 h-10 bg-slate-200 rounded-lg " />
        </div>
        <div className="sm:col-span-3">
          <div className="h-6 max-w-[6rem] bg-slate-200 rounded-lg" />
          <div className="mt-2 h-10 bg-slate-200 rounded-lg " />
        </div>
        <div className="col-span-full">
          <div className="h-6 max-w-[6rem] bg-slate-200 rounded-lg" />
          <div className="mt-2 h-10 bg-slate-200 rounded-lg " />
        </div>
        <div className="col-span-full">
          <div className="h-6 max-w-[6rem] bg-slate-200 rounded-lg" />
          <div className="mt-2 h-10 bg-slate-200 rounded-lg " />
        </div>
      </div>
    </Skeleton>
  );
  return (
    <>
      {user && userStripeInfo ? (
        <form className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full flex items-center gap-x-8">
              {user?.image ? (
                <Image
                  src={user?.image}
                  alt="user avatar"
                  className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
                  width={250}
                  height={250}
                />
              ) : (
                avatarImage
              )}
            </div>

            <div className="sm:col-span-3">
              <Label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-800"
              >
                First name
              </Label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="first-name"
                  id="first-name"
                  defaultValue={user?.name?.split(' ')[0]}
                  autoComplete="given-name"
                  disabled={isInputsDisabled}
                  className="bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <Label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-800"
              >
                Last name
              </Label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="last-name"
                  id="last-name"
                  defaultValue={user?.name?.split(' ')[1]}
                  autoComplete="family-name"
                  disabled={isInputsDisabled}
                  className="bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                />
              </div>
            </div>

            <div className="col-span-full">
              <Label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-800"
              >
                Email address
              </Label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user?.email as string}
                  autoComplete="email"
                  disabled={isInputsDisabled}
                  className="bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                />
              </div>
            </div>

            <div className="col-span-full">
              <Label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-gray-800"
              >
                Phone
              </Label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="phone"
                  id="phone"
                  defaultValue={userStripeInfo?.phone as string}
                  autoComplete="tel"
                  disabled={isInputsDisabled}
                  className="bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                />
              </div>
            </div>
          </div>
        </form>
      ) : (
        skeletonLoadingUI
      )}
    </>
  );
}
