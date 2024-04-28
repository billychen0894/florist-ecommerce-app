import backgroundImage from '@/public/images/cover2.jpg';
import Image from 'next/image';

export default function AuthBackgroundImage() {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="w-full h-full" aria-hidden="true">
        <Image
          src={backgroundImage}
          alt="Background Image"
          className="h-full w-full object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gray-500 opacity-25" />
      </div>
    </div>
  );
}
