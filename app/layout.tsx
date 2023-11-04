import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { headers } from 'next/headers';
import Script from 'next/script';

import { Footer } from '@components/Footer';
import { Navigation } from '@components/Navigation';
import AuthProvider from '@components/Providers/AuthProvider';
import ReduxProvider from '@store/ReduxProvider';
import '@styles/globals.css';
import QueryProvider from '@components/Providers/QueryProvider';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_BASE_URL),
  title: 'Blossom Lane',
  description: 'Florist eCommerce website',
  keywords: ['eCommerce', 'Florist', 'Bouquets', 'Flowers', 'Plants'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = headers().get('x-nonce');

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <QueryProvider>
          <ReduxProvider>
            <AuthProvider>
              <Toaster
                toastOptions={{
                  style: {
                    color: '#111827',
                    fontSize: '0.8rem',
                    backgroundColor: '#F9FAFB',
                  },
                }}
              />
              <Navigation />
              {children}
              <Footer />
            </AuthProvider>
          </ReduxProvider>
        </QueryProvider>
      </body>
      <Script strategy="afterInteractive" nonce={nonce ? nonce : undefined} />
    </html>
  );
}
