'use client';
import { ScrollUpButton } from '@radix-ui/react-select';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import cn from '~/utils/cn';

const SelectScrollUpButton = forwardRef<ElementRef<typeof ScrollUpButton>, ComponentPropsWithoutRef<typeof ScrollUpButton>>(
  ({ className, ...props }, ref) => (
    <ScrollUpButton ref={ref} className={cn('flex cursor-default items-center justify-center py-1', className)} {...props}>
      <span className="h-3 w-3 bg-primary-200 mask-[url('./assets/icons/chevronUp.svg')]" />
    </ScrollUpButton>
  ),
);
SelectScrollUpButton.displayName = ScrollUpButton.displayName;

export default SelectScrollUpButton;
