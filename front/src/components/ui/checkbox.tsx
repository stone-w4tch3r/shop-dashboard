'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot='checkbox'
      className={cn(
        // Base styles matching Figma design
        'peer shrink-0 rounded-[5px] border-[1.25px] transition-all outline-none',
        // Size: 30px x 30px (larger to match Figma)
        'size-[30px]',
        // Default state: dark background with secondary border (#131418 bg, #393939 border)
        'border-[#393939] bg-[#131418]',
        // Checked state: accent blue background, no border (#3C88ED)
        'data-[state=checked]:border-[#3C88ED] data-[state=checked]:bg-[#3C88ED]',
        // Text color for check icon
        'data-[state=checked]:text-[#FEFEFE]',
        // Focus styles
        'focus-visible:ring-2 focus-visible:ring-[#3C88ED]/50 focus-visible:ring-offset-2',
        // Disabled styles
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Invalid styles
        'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot='checkbox-indicator'
        className='flex items-center justify-center text-current transition-none'
      >
        <CheckIcon className='size-4 stroke-[2px]' />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
