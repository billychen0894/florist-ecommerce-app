import * as React from 'react';

import { cn } from '@lib/classNames';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export interface SelectOptionProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
          className
        )}
        {...props}
      />
    );
  }
);
Select.displayName = 'Select';

export const SelectOption = React.forwardRef<
  HTMLOptionElement,
  SelectOptionProps
>(({ className, ...props }, ref) => {
  return <option ref={ref} className={cn(className)} {...props} />;
});
SelectOption.displayName = 'SelectOption';
