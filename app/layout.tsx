import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { headers } from 'next/headers';
import Script from 'next/script';

import '@styles/globals.css';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_BASE_URL),
  title: 'Blossom Lane',
  description: 'Florist eCommerce website',
  keywords: ['eCommerce', 'Florist', 'Bouquets', 'Flowers', 'Plants'],
  openGraph: {
    title: 'Blossom Lane',
    description: 'Florist eCommerce website',
    images: [
      `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/uh4uugkjpvljfwq8q4x5`,
    ],
  },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = headers().get('x-nonce');
  const QueryProvider = dynamic(
    () => import('@components/Providers/QueryProvider')
  );
  const ReduxProvider = dynamic(() => import('@store/ReduxProvider'));
  const AuthProvider = dynamic(
    () => import('@components/Providers/AuthProvider')
  );

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
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
              {children}
            </AuthProvider>
          </ReduxProvider>
        </QueryProvider>
      </body>
      <Script strategy="afterInteractive" nonce={nonce ? nonce : undefined} />
    </html>
  );
}
