import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * React-Bits-style SplitText: splits a heading into words (or characters) and
 * reveals each with a blurred rise + stagger when it scrolls into view.
 *
 * For gradient headings pass `gradient` — the text-grad clip is applied per word
 * (so opacity/blur/transform animate cleanly), rather than on the container where
 * background-clip:text would fight the per-word transforms.
 */
const wordVariant = (duration) => ({
  hidden: { opacity: 0, y: '0.6em', filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    transition: { duration, ease: [0.2, 0.7, 0.2, 1] },
  },
})

export function SplitText({
  text,
  as = 'span',
  by = 'word',
  gradient = false,
  className,
  wordClassName,
  stagger = 0.055,
  delay = 0.05,
  duration = 0.55,
  once = true,
  ...rest
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as] || motion.span

  // Guard: only strings can be split. Anything else renders as-is.
  if (typeof text !== 'string' || reduce) {
    const Static = as
    return (
      <Static className={cn(className, gradient && 'text-grad')} {...rest}>
        {text}
      </Static>
    )
  }

  const units = by === 'char' ? Array.from(text) : text.split(' ')
  const v = wordVariant(duration)

  return (
    <Tag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '0px 0px -10% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...rest}
    >
      {units.flatMap((unit, i) => {
        const el = (
          <motion.span
            key={`u${i}`}
            aria-hidden
            variants={v}
            className={cn(
              'inline-block will-change-[transform,opacity,filter]',
              gradient && 'text-grad',
              wordClassName
            )}
          >
            {unit === ' ' ? ' ' : unit}
          </motion.span>
        )
        // Insert a real, breakable space between words so long headings still wrap.
        return by === 'word' && i < units.length - 1 ? [el, ' '] : [el]
      })}
    </Tag>
  )
}
