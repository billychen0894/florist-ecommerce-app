'use client';

import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Input, Label } from '@components/ui';
import Button from '@components/ui/Button';
import { useAppSelector } from '@store/hooks';
import ProfileAndSettingsSkeleton from './ProfileAndSettingsSkeleton';
import {
  PersonalInfoFormSchema,
  defaultPersonalInfoFormSchema,
} from './personalInfoFormValidator';

const defaultAvatarImage = (
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
  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.image || ''
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
    control,
  } = methods;

  const onSubmit = (data: PersonalInfoFormSchema) => {
    // TODO: Upload file image to Cloudinary
    const file = data.imageFile;
    console.log(data);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setPreviewImage(event.target && (event.target.result as string));
      };

      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <>
      {user && userStripeInfo ? (
        <form className="md:col-span-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full flex items-center gap-x-8">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="user avatar"
                  className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
                  width={250}
                  height={250}
                />
              ) : (
                defaultAvatarImage
              )}
              {!isInputsDisabled && (
                <div>
                  <Label
                    htmlFor="imageFile"
                    className="rounded-md max-w-[8rem] px-3.5 py-2.5 cursor-pointer bg-secondary-500 hover:bg-secondary-400 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-500"
                  >
                    Change avatar
                  </Label>
                  <p className="mt-2 text-xs leading-5 text-gray-400">
                    JPG, JPEG or PNG. 1MB max.
                  </p>
                  <Controller
                    name="imageFile"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="imageFile"
                        type="file"
                        className="hidden"
                        name="imageFile"
                        accept="image/jpg, image/jpeg, image/png"
                        onChange={(e) => {
                          field.onChange(e.target.files && e.target.files[0]); // This is important to update the form control value
                          handleImageChange(e); // Handle image preview
                        }}
                      />
                    )}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="imageFile"
                    as="p"
                    className="text-xs font-medium text-red-500"
                  />
                </div>
              )}
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
