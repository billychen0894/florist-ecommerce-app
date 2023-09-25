'use client';

import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { imageUpload } from '@actions/imageUpload';
import { Input, Label } from '@components/ui';
import Button from '@components/ui/Button';
import Spinner from '@components/ui/Spinner';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import { users } from '@lib/api/users';
import { updateUserInfo } from '@store/features/userSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
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
  const dispatch = useAppDispatch();
  const axiosWithAuth = useAxiosWithAuth();
  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.image || ''
  );

  const methods = useForm<PersonalInfoFormSchema>({
    resolver: yupResolver(defaultPersonalInfoFormSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    control,
    setValue,
  } = methods;

  useEffect(() => {
    const formDefaultValues: { [key: string]: string } = {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      contactPhone: user?.phone || '',
      imageFile: user?.image || '',
    };

    Object.keys(formDefaultValues).forEach((key) =>
      setValue(key, formDefaultValues[key] as never)
    );
  }, [user?.image, user?.name, user?.phone, setValue]);

  const handleImageUpload = useCallback(
    async (file: File, cloudinaryPublicId?: string) => {
      // Return a Promise that resolves with the uploadResult or undefined
      return new Promise<{ public_id: string; url: string } | undefined>(
        async (resolve) => {
          const reader = new FileReader();

          // Set up an event handler for when the FileReader operation is complete
          reader.onload = async (event) => {
            if (event.target) {
              // Inside this event handler, we await imageUpload to process the result
              const uploadResult = await imageUpload(
                event.target.result,
                cloudinaryPublicId
              );

              // Resolve the Promise with the uploadResult
              resolve(uploadResult);
            }
          };

          // Start reading the image file asynchronously
          reader.readAsDataURL(file);
        }
      );
    },
    []
  );

  const handleUserUpdate = useCallback(
    async (userData: {
      firstName: string;
      lastName: string;
      phone: string;
      uploadResult?: { public_id: string; url: string };
    }) => {
      const { firstName, lastName, phone, uploadResult } = userData;
      const image = uploadResult
        ? uploadResult.url
        : user?.image
        ? user?.image
        : '';

      dispatch(
        updateUserInfo({
          firstName,
          lastName,
          phone,
          image,
        })
      );

      await users.updateUser(
        {
          name: `${firstName} ${lastName}`,
          phone,
          image,
          cloudinaryPublicId: uploadResult?.public_id || '',
        },
        user?.id!,
        axiosWithAuth
      );

      toast.success('Personal Info successfully updated!');
    },
    [axiosWithAuth, dispatch, user?.id, user?.image]
  );

  const onSubmit = async (data: PersonalInfoFormSchema) => {
    try {
      if (!isDirty) {
        toast.error('No information updated. Cannot save');
        return;
      }

      const { firstName, lastName, contactPhone: phone, imageFile } = data;
      const name = `${firstName} ${lastName}`;

      if (
        name === user?.name &&
        phone === user?.phone &&
        typeof imageFile === 'string'
      ) {
        toast.error('No information updated. Cannot save');
        return;
      }

      const file = imageFile as File;
      let uploadResult: { public_id: string; url: string } | undefined =
        undefined;

      if (file && typeof file !== 'string') {
        uploadResult = await handleImageUpload(file, user?.cloudinaryPublicId!);

        if (uploadResult && firstName && lastName) {
          console.log('fire file user update');
          handleUserUpdate({
            firstName,
            lastName,
            phone: phone!,
            uploadResult,
          });
        }
      } else {
        console.log('fire user update');
        handleUserUpdate({
          firstName: firstName!,
          lastName: lastName!,
          phone: phone!,
          uploadResult: undefined,
        });
      }
    } catch (err: any) {
      console.log('Error during update personal information: ', err.message);
    }
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
    <form className="md:col-span-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-full flex items-center gap-x-8">
          {previewImage || user?.image ? (
            <Image
              src={previewImage! || user?.image!}
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
                    defaultValue={user?.image ? user?.image : ''}
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
              defaultValue={
                user?.name?.split(' ')[0] ? user?.name?.split(' ')[0] : ''
              }
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
              defaultValue={
                user?.name?.split(' ')[1] ? user?.name?.split(' ')[1] : ''
              }
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
            htmlFor="phone"
            className="block text-sm font-medium leading-6 text-gray-800"
          >
            Phone
          </Label>
          <div className="mt-2">
            <Input
              type="text"
              id="contactPhone"
              defaultValue={user?.phone ? user?.phone : ''}
              autoComplete="tel"
              {...register('contactPhone')}
              disabled={isInputsDisabled}
              className={`${
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
              className={
                isSubmitting
                  ? 'bg-secondary-200 text-secondary-400 cursor-not-allowed border-secondary-300 hover:bg-secondary-200'
                  : 'bg-secondary-500 hover:bg-secondary-400'
              }
              disabled={isSubmitting}
            >
              <div className="flex">
                {isSubmitting && <Spinner />}
                <span className="block">Save</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
