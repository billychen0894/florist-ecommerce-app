import { XCircleIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';

type ImageUploadPreviewProps = {
  index: number;
  imageUrl: string;
  onClick: () => void;
};
export default function ImageUploadPreview({
  index,
  imageUrl,
  onClick,
}: ImageUploadPreviewProps) {
  return (
    <div key={index} className="relative">
      <Image
        key={index}
        src={imageUrl}
        alt={`ImageUpload-${index}`}
        className="h-24 w-24 rounded-lg bg-gray-800 object-cover"
        width={96}
        height={96}
        sizes="96px"
      />
      <XCircleIcon
        className="h-6 w-6 cursor-pointer fill-gray-400 hover:fill-red-600 absolute -top-2 -right-2"
        onClick={onClick}
      />
    </div>
  );
}
