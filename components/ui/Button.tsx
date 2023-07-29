'use client';
import React from 'react';

import { cn } from '@lib/classNames';

interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  ref?: React.Ref<HTMLButtonElement> | null;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { type, children, className, onClick, disabled } = props;
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
          className
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
