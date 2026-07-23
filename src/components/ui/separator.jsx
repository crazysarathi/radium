import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cn } from '@/lib/utils'

export const Separator = React.forwardRef(function Separator(
  { className, orientation = 'horizontal', decorative = true, ...props },
  ref
) {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-gradient-to-r from-transparent via-beam/35 to-transparent',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px bg-gradient-to-b',
        className
      )}
      {...props}
    />
  )
})
