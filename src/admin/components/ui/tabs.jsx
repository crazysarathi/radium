import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/admin/utils'

/** shadcn/ui Tabs — same Radix primitives and pill styling as the client site. */
export const Tabs = TabsPrimitive.Root

export const TabsList = React.forwardRef(function TabsList({ className, ...props }, ref) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn('inline-flex flex-wrap items-center gap-2', className)}
      {...props}
    />
  )
})

export const TabsTrigger = React.forwardRef(function TabsTrigger({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-[12.5px] font-semibold transition-all',
        'border-black/10 text-muted-foreground hover:border-beam/30 hover:text-foreground dark:border-white/10',
        'data-[state=active]:border-beam/60 data-[state=active]:bg-beam/15 data-[state=active]:text-beam data-[state=active]:shadow-glow',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-beam/40',
        className
      )}
      {...props}
    />
  )
})

export const TabsContent = React.forwardRef(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn('mt-6 focus-visible:outline-none', className)}
      {...props}
    />
  )
})
