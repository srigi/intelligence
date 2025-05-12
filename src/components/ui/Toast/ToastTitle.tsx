import { Title } from '@radix-ui/react-toast';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

import cn from '~/utils/cn';

const ToastTitle = forwardRef<ElementRef<typeof Title>, ComponentPropsWithoutRef<typeof Title>>(({ className, ...props }, ref) => (
  <Title ref={ref} className={cn('text-sm font-semibold [&+div]:text-xs', className)} {...props} />
));
ToastTitle.displayName = Title.displayName;

export default ToastTitle;
