import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

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
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all',
        'border-white/10 text-muted-foreground hover:border-beam/30 hover:text-foreground',
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
      className={cn('mt-8 focus-visible:outline-none', className)}
      {...props}
    />
  )
})
