import { Footer } from '@components/Footer';
import { Navigation } from '@components/Navigation/Navigation';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
}
