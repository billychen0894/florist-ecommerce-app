import ContextMenu from '@components/ui/ContextMenu';
import { Controller } from '@node_modules/react-hook-form';
import ImageUploadPreview from '@components/Admin/ImageUploadPreview';
import { Input, Label } from '@components/ui';
import { PlusIcon } from '@node_modules/@heroicons/react/20/solid';
import { ErrorMessage } from '@node_modules/@hookform/error-message';
import { useFormContext } from 'react-hook-form';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';

type ImageUploadSectionProps = {
  images: { existingImages: string[]; newImages: File[] };
  setImages: Dispatch<
    SetStateAction<{ existingImages: string[]; newImages: File[] }>
  >;
};

export default function ImageUploadSection({
  images,
  setImages,
}: ImageUploadSectionProps) {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();

  const handleImageRemove = (imageCategory: string, imageIndex: number) => {
    if (imageCategory === 'existingImages') {
      setValue('images', {
        existingImages: images.existingImages.filter(
          (_, i) => i !== imageIndex
        ),
        newImages: images.newImages,
      });

      setImages((prevState) => {
        const updatedExistingImages = prevState.existingImages.filter(
          (_, i) => i !== imageIndex
        );
        return {
          existingImages: updatedExistingImages,
          newImages: prevState.newImages,
        };
      });
    }

    if (imageCategory === 'newImages') {
      setValue('images', {
        existingImages: images.existingImages,
        newImages: images.newImages.filter((_, i) => i !== imageIndex),
      });

      setImages((prevState) => {
        const updatedNewImages = prevState.newImages.filter(
          (_, i) => i !== imageIndex
        );
        return {
          existingImages: prevState.existingImages,
          newImages: updatedNewImages,
        };
      });
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
          setImages((prevState) => ({
            existingImages: prevState.existingImages,
            newImages: [...prevState.newImages, ...newImages],
          }));
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
      {images &&
        images?.existingImages.length === 0 &&
        images.newImages.length === 0 && <ContextMenu>No items</ContextMenu>}
      <Controller
        name="images"
        control={control}
        render={({ field }) => (
          <>
            {(images && images.existingImages.length > 0) ||
            images.newImages.length > 0 ? (
              <div className="mt-2 flex items-center rounded-lg border border-dashed border-gray-900/25 p-2 gap-3">
                {images.existingImages.map((image, idx) => (
                  <ImageUploadPreview
                    key={idx}
                    index={idx}
                    imageUrl={image}
                    onClick={() => handleImageRemove('existingImages', idx)}
                  />
                ))}
                {images.newImages.map((image, idx) => (
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
                  const newImageFiles = Array.from(e.target.files);
                  handleImageChange(e);
                  // Input listening to image files changes, but this onChange will override previous state,
                  // therefore, on every change newImages should be added on top of previous state
                  field.onChange({
                    existingImages: images.existingImages,
                    newImages: [...images.newImages, ...newImageFiles],
                  });
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
