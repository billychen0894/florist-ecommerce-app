'use client';

import { cn } from '@lib/classNames';
import { signIn } from 'next-auth/react';

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
  return (
    <button
      className={cn(
        'flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]',
        buttonClassName
      )}
      onClick={() =>
        signIn(provider, {
          redirect: true,
          callbackUrl: '/',
        })
      }
    >
      {icon}
      <span className="text-sm font-semibold leading-6">{providerLabel}</span>
    </button>
  );
}

export default OAuthProviderButton;
