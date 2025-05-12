'use client';
import { ScrollDownButton } from '@radix-ui/react-select';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import cn from '~/utils/cn';

const SelectScrollDownButton = forwardRef<ElementRef<typeof ScrollDownButton>, ComponentPropsWithoutRef<typeof ScrollDownButton>>(
  ({ className, ...props }, ref) => (
    <ScrollDownButton ref={ref} className={cn('flex cursor-default items-center justify-center py-1', className)} {...props}>
      <span className="h-3 w-3 bg-primary-200 mask-[url('./assets/icons/check.svg')]" />
    </ScrollDownButton>
  ),
);
SelectScrollDownButton.displayName = ScrollDownButton.displayName;

export default SelectScrollDownButton;
