import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Footer } from '@components/Footer';
import { Navigation } from '@components/Navigation';
import AuthProvider from '@components/Providers/AuthProvider';
import '@styles/globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] });

export const metadata: Metadata = {
  title: 'Blossom Lane',
  description: 'Florist eCommerce website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.className} h-full`}>
          <Navigation />
          {children}
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}
