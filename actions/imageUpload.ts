'use server';

import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
  secure: true,
});

export const imageUpload = async (file: any, public_id?: string) => {
  try {
    if (file) {
      const result = await cloudinary.v2.uploader.upload(file, {
        public_id,
        overwrite: true,
      });

      return result;
    }
  } catch (err) {
    console.error('Upload Error: ', err);
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
