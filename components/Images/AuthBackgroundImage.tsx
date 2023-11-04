'use client';

import { CldImage } from '@node_modules/next-cloudinary';

type AuthBackgroundImageProps = {
  cloudImagePublicId: string;
  base64Url: string | undefined;
};

export default function AuthBackgroundImage({
  cloudImagePublicId,
  base64Url,
}: AuthBackgroundImageProps) {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="w-full h-full" aria-hidden="true">
        <CldImage
          className="h-full w-full object-cover object-top"
          src={cloudImagePublicId}
          alt="Background Image"
          width={1630}
          height={915}
          sizes="100vw"
          priority
          blurDataURL={base64Url}
          placeholder="blur"
        />
        <div className="absolute inset-0 bg-gray-500 opacity-25" />
      </div>
    </div>
  );
}
