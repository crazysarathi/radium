import { useRef, useState } from 'react'
import { Upload, ImageOff, Loader2 } from 'lucide-react'
import { uploadFile } from '@/admin/services/apiClient'
import { useToast } from '@/admin/context/ToastContext'
import { Input } from './field'

/** Image picker: a path/URL input plus a real POST /media upload and a live preview. */
export function ImageInput({ value, onChange, placeholder = '/products/…', folder = '' }) {
  const fileRef = useRef(null)
  const toast = useToast()
  const [broken, setBroken] = useState(false)
  const [uploading, setUploading] = useState(false)

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    try {
      const uploaded = await uploadFile(file, folder)
      setBroken(false)
      onChange(uploaded.url)
    } catch (err) {
      toast.error('Upload failed', err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-[74px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-black/[.04] dark:bg-[#1a0709]/60">
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
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full border border-black/[.12] dark:border-white/12 px-3.5 py-1.5 text-[12px] font-semibold text-muted-foreground transition-all hover:border-beam/40 hover:text-foreground disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {uploading ? 'Uploading…' : 'Upload image'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>
    </div>
  )
}
