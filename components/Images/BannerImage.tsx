'use client';

import { CldImage } from '@node_modules/next-cloudinary';

type BannerImageProps = {
  cloudImagePublicId: string;
  base64Url: string | undefined;
  bannerText?: string;
};
export default function BannerImage({
  base64Url,
  bannerText,
  cloudImagePublicId,
}: BannerImageProps) {
  return (
    <div className="h-40 w-full relative isolate flex items-end">
      <CldImage
        src={cloudImagePublicId}
        alt="Sea of flowers"
        className="absolute inset-0 -z-10 h-full max-h-40 w-full object-cover object-center"
        width="1216"
        height="160"
        sizes="(min-width: 1360px) 280px, (min-width: 1040px) calc(20vw + 12px), (min-width: 820px) 344px, (min-width: 640px) calc(40vw + 24px), calc(100vw - 32px)"
        blurDataURL={base64Url}
        placeholder="blur"
        priority
        dpr="auto"
        format="webp"
        quality={50}
        overlays={[
          {
            publicId: `${cloudImagePublicId}`,
            effect: {
              aspectRatio: '38:5',
            },
          },
        ]}
      />
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-800 bg-opacity-20 -z-10"
        aria-hidden="true"
      />
      {bannerText && (
        <p className="text-base md:text-xl text-white mb-10 px-8">
          {bannerText}
        </p>
      )}
    </div>
  );
}
