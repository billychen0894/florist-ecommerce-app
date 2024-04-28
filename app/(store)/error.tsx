'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

export default function RootError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const Error = dynamic(() => import('@/components/ui/Error'));

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return <Error reset={reset} />;
}
