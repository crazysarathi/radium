import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * shadcn Card, restyled onto the Radium glass surface.
 * `interactive` adds the lift/glow hover used across product grids.
 */
export const Card = React.forwardRef(function Card({ className, interactive = false, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'glass text-card-foreground relative flex flex-col overflow-hidden',
        interactive && 'glass-hover',
        className
      )}
      {...props}
    />
  )
})

export const CardHeader = React.forwardRef(function CardHeader({ className, ...props }, ref) {
  return <div ref={ref} className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
})

export const CardTitle = React.forwardRef(function CardTitle({ className, ...props }, ref) {
  return <h3 ref={ref} className={cn('t-h3 text-foreground', className)} {...props} />
})

export const CardDescription = React.forwardRef(function CardDescription({ className, ...props }, ref) {
  return <p ref={ref} className={cn('text-[13.5px] leading-relaxed text-muted-foreground', className)} {...props} />
})

export const CardContent = React.forwardRef(function CardContent({ className, ...props }, ref) {
  return <div ref={ref} className={cn('flex flex-1 flex-col p-6 pt-0', className)} {...props} />
})

export const CardFooter = React.forwardRef(function CardFooter({ className, ...props }, ref) {
  return <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
})
