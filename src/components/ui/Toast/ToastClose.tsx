import { Close } from '@radix-ui/react-toast';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

import cn from '~/utils/cn';

const ToastClose = forwardRef<ElementRef<typeof Close>, ComponentPropsWithoutRef<typeof Close>>(({ className, ...props }, ref) => (
  <Close
    ref={ref}
    className={cn(
      'text-foreground/50 hover:text-foreground absolute top-1 right-1 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:ring-1 focus:outline-none group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
      className,
    )}
    toast-close=""
    {...props}
  >
    ✕
  </Close>
));
ToastClose.displayName = Close.displayName;

export default ToastClose;
