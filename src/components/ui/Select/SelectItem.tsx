import { Item, ItemIndicator, ItemText } from '@radix-ui/react-select';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import cn from '~/utils/cn';

const SelectItem = forwardRef<ElementRef<typeof Item>, ComponentPropsWithoutRef<typeof Item>>(({ className, children, ...props }, ref) => (
  <Item
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-4 pl-6 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-1 flex items-center">
      <ItemIndicator className="inline-block">
        <span className="block h-4 w-4 bg-primary-50 mask-[url('./assets/icons/check.svg')]" />
      </ItemIndicator>
    </span>

    <ItemText>{children}</ItemText>
  </Item>
));
SelectItem.displayName = Item.displayName;

export default SelectItem;
