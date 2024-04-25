import ContextMenu from '@components/ui/ContextMenu';
import { Controller } from '@node_modules/react-hook-form';
import ImageUploadPreview from '@components/Admin/ImageUploadPreview';
import { Input, Label } from '@components/ui';
import { PlusIcon } from '@node_modules/@heroicons/react/20/solid';
import { ErrorMessage } from '@node_modules/@hookform/error-message';
import { useFormContext } from 'react-hook-form';
import { ChangeEvent } from 'react';

export default function ImageUploadSection() {
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();

  const currentImages: {
    existingImages: { url: string; publicId?: string }[];
    newImages: File[];
  } = getValues('images');

  const handleImageRemove = (imageCategory: string, imageIndex: number) => {
    if (imageCategory === 'existingImages') {
      setValue(
        'images.existingImages',
        currentImages.existingImages.filter((_, i) => i !== imageIndex),
        { shouldValidate: true }
      );
    }

    if (imageCategory === 'newImages') {
      setValue(
        'images.newImages',
        currentImages.newImages.filter((_, i) => i !== imageIndex),
        { shouldValidate: true }
      );
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const newImages: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith('image/')) {
          continue;
        }

        newImages.push(file);

        if (newImages.length === files.length) {
          setValue(
            'images.newImages',
            [...currentImages.newImages, ...newImages],
            { shouldValidate: true }
          );
        }
      }
    }
  };

  return (
    <div className="col-span-full">
      <h3 className="block text-sm font-medium leading-6 text-gray-900">
        Images
      </h3>
      {/*Place states here: if no items then show this comp.*/}
      {currentImages &&
        currentImages?.existingImages?.length === 0 &&
        currentImages?.newImages?.length === 0 && (
          <ContextMenu>No items</ContextMenu>
        )}
      <Controller
        name="images"
        control={control}
        render={({ field }) => (
          <>
            {(currentImages && currentImages?.existingImages?.length > 0) ||
            currentImages?.newImages?.length > 0 ? (
              <div className="mt-2 flex items-center rounded-lg border border-dashed border-gray-900/25 p-2 gap-3">
                {currentImages?.existingImages?.map((image, idx) => (
                  <ImageUploadPreview
                    key={idx}
                    index={idx}
                    imageUrl={image.url}
                    onClick={() => handleImageRemove('existingImages', idx)}
                  />
                ))}
                {currentImages?.newImages?.map((image, idx) => (
                  <ImageUploadPreview
                    key={idx}
                    index={idx}
                    imageUrl={URL.createObjectURL(image)}
                    onClick={() => handleImageRemove('newImages', idx)}
                  />
                ))}
              </div>
            ) : null}
            <Input
              id="images"
              type="file"
              multiple
              accept="image/jpg, image/jpeg, image/png"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleImageChange(e);
                }
              }}
            />
          </>
        )}
      />
      <Label
        htmlFor="images"
        className="w-full mt-2 py-1.5 bg-transparent hover:bg-gray-100 text-gray-500 font-normal border border-gray-300 cursor-pointer rounded-lg"
      >
        <div className="flex justify-center items-center">
          <PlusIcon className="h-6 w-6" />
          <span>Add item</span>
        </div>
      </Label>
      <ErrorMessage
        name="images"
        errors={errors}
        as="p"
        className="text-xs font-medium text-red-500 mt-1 ml-1"
      />
    </div>
  );
}
