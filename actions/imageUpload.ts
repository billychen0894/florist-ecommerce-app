'use server';

import { readFileAsDataUrl } from '@lib/readFile';
import cloudinary, { UploadApiResponse, UploadStream } from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
  secure: true,
});

type ImageUploadResult = {
  public_id: string;
  url: string;
};

export const imageUpload = async (
  file: File,
  public_id?: string
): Promise<ImageUploadResult | undefined> => {
  try {
    if (!file || file.size === 0) throw new Error('No file provided');

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
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (err: any) {
    console.error('Upload Error: ', err);
    return undefined;
  }
};

export const multiImagesUpload = async (
  files: { imageFile: string | ArrayBuffer; publicId?: string }[]
) => {
  try {
    if (files.length === 0) throw new Error('No files');

    const imagesPromises = files.map(async (file) => {
      const { imageFile, publicId } = file;

      return new Promise<{ url: string; publicId: string } | null>(
        async (resolve) => {
          try {
            const response = await cloudinary.v2.uploader.upload(
              imageFile as string,
              {
                public_id: publicId,
                overwrite: true,
              }
            );
            resolve({
              url: response.url,
              publicId: response.public_id,
            });
          } catch (err) {
            console.error('Upload Error:', err);
            resolve(null);
          }
        }
      );
    });

    const resultObj = await Promise.all(imagesPromises);
    return resultObj.filter((item) => item !== null);
  } catch (err: any) {
    console.error('upload Error:', err);
  }
};
