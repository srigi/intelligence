import { Description } from '@radix-ui/react-toast';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

import cn from '~/utils/cn';

const ToastDescription = forwardRef<ElementRef<typeof Description>, ComponentPropsWithoutRef<typeof Description>>(
  ({ className, ...props }, ref) => <Description ref={ref} className={cn('text-sm opacity-90', className)} {...props} />,
);
ToastDescription.displayName = Description.displayName;

export default ToastDescription;
