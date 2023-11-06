import dynamic from 'next/dynamic';

export default function NotFound() {
  const NotFound = dynamic(() => import('@components/ui/NotFound'));

  return <NotFound />;
}
