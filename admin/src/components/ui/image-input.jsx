import { useRef, useState } from 'react'
import { Upload, ImageOff } from 'lucide-react'
import { fileToDataUrl } from '@/utils'
import { useToast } from '@/context/ToastContext'
import { Input } from './field'

/**
 * Image picker: a path/URL input plus a mock upload (file → data URL) and a
 * live preview. When the real backend lands, the upload branch becomes a
 * POST /api/media call returning a hosted URL — same value, same onChange.
 */
export function ImageInput({ value, onChange, placeholder = '/products/…' }) {
  const fileRef = useRef(null)
  const toast = useToast()
  const [broken, setBroken] = useState(false)

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const dataUrl = await fileToDataUrl(file)
      setBroken(false)
      onChange(dataUrl)
    } catch (err) {
      toast.error('Upload failed', err.message)
    }
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-[74px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#1a0709]/60">
        {value && !broken ? (
          <img
            src={value}
            alt=""
            className="h-full w-full object-contain"
            onError={() => setBroken(true)}
            onLoad={() => setBroken(false)}
          />
        ) : (
          <ImageOff className="h-5 w-5 text-muted-foreground/40" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <Input
          value={value ?? ''}
          onChange={(e) => {
            setBroken(false)
            onChange(e.target.value)
          }}
          placeholder={placeholder}
          className="font-mono text-[12.5px]"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3.5 py-1.5 text-[12px] font-semibold text-muted-foreground transition-all hover:border-beam/40 hover:text-foreground"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload (mock — stored locally)
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>
    </div>
  )
}
