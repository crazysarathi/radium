import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { Link } from 'react-router-dom'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * shadcn-style Button, tuned to the Radium beam theme.
 * Backwards compatible with the old API: variants primary/outline/ghost,
 * sizes sm/md/lg, plus `to` (router link) and `href` (anchor) shortcuts.
 */
export const buttonVariants = cva(
  'group/btn relative inline-flex select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-accent-grad text-[#26060a] shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5 active:translate-y-0',
        outline:
          'border border-beam/30 text-foreground hover:border-beam/70 hover:bg-beam/10 hover:-translate-y-0.5 active:translate-y-0',
        ghost: 'text-muted-foreground hover:text-foreground hover:bg-white/5',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-9 px-4 text-[13px]',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-7 text-[15px]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export const Button = React.forwardRef(function Button(
  { as, to, href, variant = 'primary', size = 'md', asChild = false, className, children, ...rest },
  ref
) {
  const cls = cn(buttonVariants({ variant, size }), className)

  // A soft sheen sweep that fires on hover — pure CSS, no JS.
  const sheen =
    variant === 'primary' ? (
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full"
      />
    ) : null

  if (asChild) return <Slot ref={ref} className={cls} {...rest}>{children}</Slot>
  if (to) return <Link ref={ref} to={to} className={cls} {...rest}>{sheen}{children}</Link>
  if (href) return <a ref={ref} href={href} className={cls} {...rest}>{sheen}{children}</a>
  const Tag = as || 'button'
  return <Tag ref={ref} className={cls} {...rest}>{sheen}{children}</Tag>
})
