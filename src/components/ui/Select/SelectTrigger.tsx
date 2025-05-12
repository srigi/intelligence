import { Icon, Trigger } from '@radix-ui/react-select';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import cn from '~/utils/cn';

const SelectTrigger = forwardRef<ElementRef<typeof Trigger>, ComponentPropsWithoutRef<typeof Trigger>>(
  ({ className, children, ...props }, ref) => (
    <Trigger
      ref={ref}
      className={cn(
        'flex h-8 w-full items-center justify-between rounded-lg border border-primary-200 bg-primary-400 px-3 py-2 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        className,
      )}
      {...props}
    >
      {children}
      <Icon asChild>
        <span className="h-3 w-3 bg-primary-50 mask-[url('./assets/icons/chevronDown.svg')]" />
      </Icon>
    </Trigger>
  ),
);
SelectTrigger.displayName = Trigger.displayName;

export default SelectTrigger;
