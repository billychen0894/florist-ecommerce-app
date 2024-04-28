'use client';

import { Tab } from '@headlessui/react';
import Image from 'next/image';

import { cn } from '@/lib/classNames';
import { TProduct } from '@/lib/types/types';

interface ProductImageGalleryProps {
  product: TProduct | null;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      {/* Image selector */}
      <div className="mx-auto mt-6 hidden w-full h-full max-w-2xl sm:block lg:max-w-none">
        <Tab.List className="grid grid-cols-4 gap-6">
          {product?.images.map((image) => (
            <Tab
              key={image.id}
              className="relative flex h-28 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-50 focus:ring-offset-4"
            >
              {({ selected }) => (
                <>
                  <span className="sr-only">{image.name}</span>
                  <span className="absolute inset-0 overflow-hidden rounded-md">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      className="h-full w-full object-cover object-center"
                      width={130}
                      height={130}
                      sizes="(min-width: 1360px) 130px, (min-width: 1040px) 10vw, (min-width: 780px) 150px, calc(16.67vw + 23px)"
                      quality={50}
                      priority
                    />
                  </span>
                  <span
                    className={cn(
                      selected ? 'ring-primary-500' : 'ring-transparent',
                      'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </Tab>
          ))}
        </Tab.List>
      </div>

      <Tab.Panels className="aspect-h-1 aspect-w-1 w-full h-full">
        {product?.images.map((image) => (
          <Tab.Panel key={image.id}>
            <Image
              src={image.url}
              alt={image.alt}
              className="h-full w-full object-cover object-center sm:rounded-lg"
              width={672}
              height={672}
              sizes="(min-width: 1360px) 592px, (min-width: 1040px) calc(40vw + 56px), (min-width: 780px) 672px, (min-width: 640px) calc(66.67vw + 165px), 100vw"
              quality={50}
              priority
            />
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
