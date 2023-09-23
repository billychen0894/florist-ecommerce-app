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

      console.log('result', result);
      return result;
    }
  } catch (err) {
    console.error('Upload Error: ', err);
  }
};
