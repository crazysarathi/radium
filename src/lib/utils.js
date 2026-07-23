import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => twMerge(clsx(inputs))

/** 8 -> "8 TB", 512 -> "512 TB", 1024 -> "1.0 PB" */
export const formatCapacity = (tb) => {
  if (tb >= 1000) return `${(tb / 1000).toFixed(tb % 1000 === 0 ? 0 : 1)} PB`
  return `${tb} TB`
}
