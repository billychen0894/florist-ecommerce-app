import Image, { StaticImageData } from 'next/image';

type BannerImageProps = {
  bannerImage: StaticImageData;
  bannerImageAlt: string;
  bannerText?: string;
};
export default function BannerImage({
  bannerImage,
  bannerImageAlt,
  bannerText,
}: BannerImageProps) {
  return (
    <div className="h-40 w-full relative isolate flex items-end">
      <Image
        src={bannerImage}
        alt={bannerImageAlt}
        quality={50}
        priority
        className="absolute inset-0 -z-10 h-full max-h-40 w-full object-cover object-center"
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
