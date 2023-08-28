'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

import Button from '@components/ui/Button';
import { cn } from '@lib/classNames';

interface OAuthProviderButtonProps {
  provider: string;
  providerLabel: string;
  icon?: React.ReactNode;
  buttonClassName?: string;
}

function OAuthProviderButton({
  provider,
  providerLabel,
  icon,
  buttonClassName,
}: OAuthProviderButtonProps) {
  const callbackUrlEncoded = useSearchParams().get('callbackUrl');
  const callbackUrl = callbackUrlEncoded
    ? decodeURIComponent(callbackUrlEncoded)
    : '/';

  return (
    <Button
      type="button"
      className={cn(
        'flex w-full items-center justify-center gap-3 bg-[#24292F] px-3 py-1.5 focus-visible:outline-[#24292F]',
        buttonClassName
      )}
      onClick={() =>
        signIn(provider, {
          redirect: true,
          callbackUrl: callbackUrl,
        })
      }
    >
      {icon}
      <span className="text-sm font-semibold leading-6">{providerLabel}</span>
    </Button>
  );
}

export default OAuthProviderButton;
