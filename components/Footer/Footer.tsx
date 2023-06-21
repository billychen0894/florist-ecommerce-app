import Image from 'next/image';
import Link from 'next/link';

import { IconWrapper, footerNavigation, hasIcon } from '@const/navigation';
import { FooterItem } from './FooterItem';

export function Footer() {
  return (
    <footer className="bg-primary-300" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-4 lg:px-8 lg:pt-8">
        <div className="md:grid md:grid-cols-2 md:gap-8">
          <div className="space-y-4">
            <Image
              className="h-24"
              src="/images/logo.png"
              alt="Company Logo"
              width={100}
              height={100}
            />
            <p className="text-sm leading-6 text-gray-800">
              Blossom Lane is dedicated to spreading joy and celebrating
              life&apos;s moments through exquisite floral experiences that
              captivate the senses and touch the heart.
            </p>
            <div className="flex space-x-6">
              {footerNavigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-secondary-500 hover:text-secondary-400"
                >
                  <span className="sr-only">{item.name}</span>
                  {hasIcon(item) && <IconWrapper icon={item.icon} />}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 lg:col-span-1 xl:mt-0">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <FooterItem
                  pages={footerNavigation.services}
                  pageTitle="Service"
                />
              </div>
              <div>
                <FooterItem
                  pages={footerNavigation.company}
                  pageTitle="Company"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-900/10 pt-8 sm:mt-12 lg:mt-16">
          <p className="text-xs leading-5 text-gray-500">
            &copy; 2023 Blossom Lane, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
