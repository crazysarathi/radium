import { cn } from '@/utils'

/** Label + control + error/hint wrapper used by every form. */
export function Field({ label, hint, error, required, className, children }) {
  return (
    <label className={cn('block', className)}>
      {label ? (
        <span className="mb-1.5 flex items-baseline justify-between gap-3">
          <span className="text-[12.5px] font-semibold text-foreground/80">
            {label}
            {required ? <span className="ml-1 text-beam">*</span> : null}
          </span>
          {hint ? <span className="text-[11px] text-muted-foreground/70">{hint}</span> : null}
        </span>
      ) : null}
      {children}
      {error ? <span className="mt-1.5 block text-[12px] font-medium text-destructive">{error}</span> : null}
    </label>
  )
}

export function Input({ className, ...rest }) {
  return <input className={cn('field-input', className)} {...rest} />
}

export function Textarea({ className, rows = 4, ...rest }) {
  return <textarea rows={rows} className={cn('field-input leading-relaxed', className)} {...rest} />
}

export function Select({ className, children, ...rest }) {
  return (
    <select className={cn('field-input', className)} {...rest}>
      {children}
    </select>
  )
}

/** Accessible switch styled to the beam accent. */
export function Toggle({ checked, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'inline-flex items-center gap-2.5 disabled:cursor-not-allowed disabled:opacity-50',
        label ? '' : ''
      )}
    >
      <span
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300',
          checked ? 'border-beam/60 bg-beam/80 shadow-glow' : 'border-white/15 bg-white/[.06]'
        )}
      >
        <span
          className={cn(
            'absolute top-1/2 h-4.5 w-4.5 -translate-y-1/2 rounded-full transition-all duration-300',
            checked ? 'left-[22px] bg-[#26060a]' : 'left-[3px] bg-muted-foreground'
          )}
          style={{ width: 18, height: 18 }}
        />
      </span>
      {label ? <span className="text-[13px] font-medium text-foreground/85">{label}</span> : null}
    </button>
  )
}
