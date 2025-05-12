import { Root, Thumb } from '@radix-ui/react-switch';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

import cn from '~/utils/cn';

const Switch = forwardRef<ElementRef<typeof Root>, ComponentPropsWithoutRef<typeof Root>>(({ className, ...props }, ref) => (
  <Root
    className={cn(
      'peer focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-300 data-[state=unchecked]:bg-gray-500',
      className,
    )}
    {...props}
    ref={ref}
  >
    <Thumb
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-full bg-primary-100 shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-gray-400',
      )}
    />
  </Root>
));
Switch.displayName = Root.displayName;

export default Switch;
