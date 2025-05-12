import { Action } from '@radix-ui/react-toast';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

import cn from '~/utils/cn';

const ToastAction = forwardRef<ElementRef<typeof Action>, ComponentPropsWithoutRef<typeof Action>>(({ className, ...props }, ref) => (
  <Action
    ref={ref}
    className={cn(
      'hover:bg-secondary focus:ring-ring group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:ring-1 focus:outline-none disabled:pointer-events-none disabled:opacity-50',
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = Action.displayName;

export default ToastAction;
