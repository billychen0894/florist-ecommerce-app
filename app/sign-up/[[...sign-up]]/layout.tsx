import Image from 'next/image';

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 h-screen justify-center items-center px-4 py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/cover1.jpg"
          alt="Sign in background image"
          width={1920}
          height={1280}
          quality={100}
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 w-full h-full bg-black opacity-50"></div>
      </div>
      {children}
    </div>
  );
}
