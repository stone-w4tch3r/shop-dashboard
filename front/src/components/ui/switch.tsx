'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        // Base styles matching Figma design
        'peer inline-flex shrink-0 items-center rounded-full border-transparent transition-all outline-none',
        // Size: 49px x 26px (matching Figma)
        'h-[26px] w-[49px]',
        // Background colors: gray (#393939) unchecked, blue (#3C88ED) checked
        'data-[state=checked]:bg-[#3C88ED] data-[state=unchecked]:bg-[#393939]',
        // Focus styles
        'focus-visible:ring-2 focus-visible:ring-[#3C88ED]/50 focus-visible:ring-offset-2',
        // Disabled styles
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          // Thumb styles: 20px circle, white color, 10px border radius
          'pointer-events-none block size-5 rounded-[10px] bg-[#FEFEFE] ring-0 transition-transform',
          // Position: 3px from edge when unchecked, 26px from left when checked
          'data-[state=checked]:translate-x-[26px] data-[state=unchecked]:translate-x-[3px]'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
