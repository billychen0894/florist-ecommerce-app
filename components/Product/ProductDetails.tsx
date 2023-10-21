'use client';

import { Disclosure } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';

import { cn } from '@lib/classNames';
import { TProduct } from '@lib/types/api';

interface ProductDetailsProps {
  product: TProduct | null;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <section aria-labelledby="details-heading" className="mt-12">
      <h2 id="details-heading" className="sr-only">
        Additional details
      </h2>

      <div className="divide-y divide-gray-200 border-t">
        {product?.productDetail.productDetailItems.map((detailItem) => (
          <Disclosure as="div" key={detailItem.id}>
            {({ open }) => (
              <>
                <h3>
                  <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                    <span
                      className={cn(
                        open ? 'text-primary-500' : 'text-gray-900',
                        'text-sm font-medium'
                      )}
                    >
                      {detailItem.productDetailItemName}
                    </span>
                    <span className="ml-6 flex items-center">
                      {open ? (
                        <MinusIcon
                          className="block h-6 w-6 text-primary-400 group-hover:text-primary-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <PlusIcon
                          className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                  <ul role="list">
                    {detailItem.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </section>
  );
}
