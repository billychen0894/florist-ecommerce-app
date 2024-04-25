import { ImageUploadResult } from './types/types';

export const transformImageObj = (image: ImageUploadResult) =>
  image && {
    url: image.url,
    publicId: image.publicId,
    name: `image-${image.publicId || image.url}`,
    alt: `image-${image.publicId || image.url}`,
  };
