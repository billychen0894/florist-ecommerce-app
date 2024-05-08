'use server';

import { ImageUploadResult } from '@/lib/types/types';
import cloudinary, { UploadApiResponse } from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
  secure: true,
});

export const imageUpload = async (
  file: File,
  public_id?: string
): Promise<ImageUploadResult | undefined> => {
  try {
    if (!file) throw new Error('No file provided');

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const result = await new Promise<UploadApiResponse | undefined>(
      (resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            { public_id, overwrite: true },
            function (error, result) {
              if (error) {
                console.error('Upload Error: ', error);
                reject(error);
                return;
              }

              resolve(result);
            }
          )
          .end(buffer);
      }
    );

    if (!result) return undefined;

    return {
      publicId: result.public_id,
      url: result.secure_url,
    };
  } catch (err: any) {
    console.error('Upload Error: ', err);
    return undefined;
  }
};
