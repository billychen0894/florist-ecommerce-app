'use client';

import Image from 'next/image';

import { Input, Label } from '@components/ui';
import Button from '@components/ui/Button';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppSelector } from '@store/hooks';
import { useForm } from 'react-hook-form';
import ProfileAndSettingsSkeleton from './ProfileAndSettingsSkeleton';
import {
  PersonalInfoFormSchema,
  defaultPersonalInfoFormSchema,
} from './personalInfoFormValidator';

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

  const methods = useForm<PersonalInfoFormSchema>({
    resolver: yupResolver(defaultPersonalInfoFormSchema),
    defaultValues: {
      firstName: user?.name?.split(' ')[0],
      lastName: user?.name?.split(' ')[1],
      email: user?.email as string,
      contactPhone: userStripeInfo?.phone as string,
      imageFile: user?.image,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: PersonalInfoFormSchema) => {
    console.log(data);
  };

  return (
    <>
      {user && userStripeInfo ? (
        <form className="md:col-span-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full flex items-center gap-x-8">
              {/* TODO: IMAGE UPLOAD AND PREVIEW */}
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
              <div>
                <Button
                  type="button"
                  className="bg-secondary-500 hover:bg-secondary-400"
                >
                  Change avatar
                </Button>
                <p className="mt-2 text-xs leading-5 text-gray-400">
                  JPG or PNG. 1MB max.
                </p>
              </div>
            </div>

            <div className="sm:col-span-3">
              <Label
                htmlFor="firstName"
                className="block text-sm font-medium leading-6 text-gray-800"
              >
                First name
              </Label>
              <div className="mt-2">
                <Input
                  type="text"
                  id="firstName"
                  defaultValue={user?.name?.split(' ')[0]}
                  autoComplete="given-name"
                  {...register('firstName')}
                  disabled={isInputsDisabled}
                  className={` ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                      : null
                  }`}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="firstName"
                as="p"
                className="text-sm font-medium text-red-500 mt-1 ml-1"
              />
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
                  id="lastName"
                  defaultValue={user?.name?.split(' ')[1]}
                  autoComplete="family-name"
                  {...register('lastName')}
                  disabled={isInputsDisabled}
                  className={` ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                      : null
                  }`}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="lastName"
                as="p"
                className="text-sm font-medium text-red-500 mt-1 ml-1"
              />
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
                  type="email"
                  defaultValue={user?.email as string}
                  autoComplete="email"
                  {...register('email')}
                  disabled={isInputsDisabled}
                  className={` ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                      : null
                  }`}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="email"
                as="p"
                className="text-sm font-medium text-red-500 mt-1 ml-1"
              />
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
                  id="contactPhone"
                  defaultValue={userStripeInfo?.phone as string}
                  autoComplete="tel"
                  {...register('contactPhone')}
                  disabled={isInputsDisabled}
                  className={` ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                      : null
                  }`}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="contactPhone"
                as="p"
                className="text-sm font-medium text-red-500 mt-1 ml-1"
              />
              <div className="mt-8 flex">
                <Button
                  type="submit"
                  className="bg-secondary-500 hover:bg-secondary-400"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <ProfileAndSettingsSkeleton />
      )}
    </>
  );
}
