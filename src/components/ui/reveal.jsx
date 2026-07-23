import { motion, useReducedMotion } from 'framer-motion'

const PRESETS = {
  up: { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -26 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1 } },
  blur: { hidden: { opacity: 0, y: 20, filter: 'blur(10px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)' } },
}

/**
 * Framer-motion scroll reveal for hero-grade moments where the CSS `.reveal`
 * observer isn't expressive enough. Variants: up | down | left | right | scale | blur.
 */
export function Reveal({ children, as = 'div', variant = 'up', delay = 0, duration = 0.7, once = true, className, ...rest }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  if (reduce) {
    const Tag = as
    return <Tag className={className} {...rest}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '0px 0px -12% 0px' }}
      variants={PRESETS[variant] || PRESETS.up}
      transition={{ duration, delay, ease: [0.2, 0.7, 0.2, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
