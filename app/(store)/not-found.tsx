import dynamic from 'next/dynamic';

export default function NotFoundPage() {
  const NotFound = dynamic(() => import('@/components/ui/NotFound'));

  return <NotFound />;
}
