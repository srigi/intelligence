import { Label } from '@radix-ui/react-select';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import cn from '~/utils/cn';

const SelectLabel = forwardRef<ElementRef<typeof Label>, ComponentPropsWithoutRef<typeof Label>>(({ className, ...props }, ref) => (
  <Label ref={ref} className={cn('py-1.5 pr-2 pl-8 text-sm font-semibold', className)} {...props} />
));
SelectLabel.displayName = Label.displayName;

export default SelectLabel;
