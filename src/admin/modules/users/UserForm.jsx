import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { api } from '@/admin/services'
import { useAuth } from '@/admin/context/AuthContext'
import { useToast } from '@/admin/context/ToastContext'
import {
  PageHeader, Button, Field, Input, Select, Toggle, PageLoading,
} from '@/admin/components/ui'

const ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

const BLANK = {
  email: '',
  password: '',
  full_name: '',
  role: 'viewer',
  is_active: true,
}

export default function UserForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { user: me } = useAuth()
  const isSelf = isEdit && id === me?.id

  const [form, setForm] = useState(isEdit ? null : BLANK)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    api.users.get(id)
      .then((u) => {
        if (!u) {
          toast.error('Not found', 'That user does not exist.')
          navigate('/users')
          return
        }
        setForm({
          email: u.email,
          password: '',
          full_name: u.full_name,
          role: u.role,
          is_active: u.is_active,
        })
      })
      .catch((err) => {
        // Anything other than a 404 (network down, 500, malformed id → 422)
        // would otherwise leave the page on PageLoading forever.
        toast.error('Could not load user', err.message)
        navigate('/users')
      })
  }, [id, isEdit, navigate, toast])

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const validate = () => {
    const e = {}
    if (!form.full_name.trim()) e.full_name = 'Name is required.'
    if (!isEdit) {
      if (!form.email.trim()) e.email = 'Email is required.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email address.'
      if (!form.password) e.password = 'A password is required.'
      else if (form.password.length < 8 || form.password.length > 64) e.password = 'Between 8 and 64 characters.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Check the form', 'Some required fields are missing or invalid.')
      return
    }
    setSaving(true)
    try {
      if (isEdit) {
        // UserUpdate only accepts full_name / role / is_active — and the
        // backend rejects any attempt to change your own role or deactivate
        // yourself, so a self-edit only ever sends the name.
        const patch = isSelf
          ? { full_name: form.full_name.trim() }
          : { full_name: form.full_name.trim(), role: form.role, is_active: form.is_active }
        await api.users.update(id, patch)
        toast.success('Saved', `${patch.full_name} updated.`)
      } else {
        await api.users.create({
          email: form.email.trim(),
          password: form.password,
          full_name: form.full_name.trim(),
          role: form.role,
          is_active: form.is_active,
        })
        toast.success('Created', `${form.full_name.trim()} can now sign in to the console.`)
      }
      queryClient.invalidateQueries({ queryKey: [api.users.key] })
      navigate('/users')
    } catch (err) {
      toast.error('Save failed', err.message)
      setSaving(false)
    }
  }

  if (!form) return <PageLoading />

  return (
    <form onSubmit={onSubmit}>
      <PageHeader
        trail={[{ label: 'Users', to: '/users' }, { label: isEdit ? form.full_name : 'New user' }]}
        eyebrow="Access"
        title={isEdit ? `Edit — ${form.full_name}` : 'New user'}
        actions={
          <>
            <Button variant="ghost" onClick={() => navigate('/users')}>
              Cancel
            </Button>
            <Button as="button" type="submit" loading={saving}>
              <Save className="h-4 w-4" />
              {isEdit ? 'Save changes' : 'Create user'}
            </Button>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_.55fr]">
        <div className="space-y-5">
          {/* Identity */}
          <section className="glass p-6 shadow-card md:p-7">
            <h2 className="t-h3 mb-5 text-foreground">Identity</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" required error={errors.full_name}>
                <Input value={form.full_name} onChange={(e) => set({ full_name: e.target.value })} placeholder="Priya Sharma" />
              </Field>
              <Field label="Email" required={!isEdit} error={errors.email} hint={isEdit ? 'cannot be changed' : 'used to sign in'}>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set({ email: e.target.value })}
                  placeholder="priya@radium.example"
                  disabled={isEdit}
                  className={isEdit ? 'opacity-60' : undefined}
                />
              </Field>
            </div>
          </section>

          {/* Credentials */}
          <section className="glass p-6 shadow-card md:p-7">
            <h2 className="t-h3 mb-5 text-foreground">Credentials</h2>
            {isEdit ? (
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                Passwords cannot be reset from the console — the account owner signs in with the password
                chosen when the account was created.
              </p>
            ) : (
              <Field label="Password" required error={errors.password} hint="8–64 characters">
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => set({ password: e.target.value })}
                  placeholder="••••••••"
                />
              </Field>
            )}
          </section>
        </div>

        <div className="space-y-5">
          {/* Access */}
          <section className="glass p-6 shadow-card md:p-7">
            <h2 className="t-h3 mb-5 text-foreground">Access</h2>
            <div className="space-y-5">
              <Field label="Role" hint={isSelf ? 'you cannot change your own role' : undefined}>
                <Select
                  value={form.role}
                  onChange={(e) => set({ role: e.target.value })}
                  disabled={isSelf}
                  className={isSelf ? 'opacity-60' : undefined}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="rounded-xl border border-black/[.08] dark:border-white/[.08] bg-black/[.02] dark:bg-white/[.02] p-4">
                <Toggle
                  checked={form.is_active}
                  onChange={(is_active) => set({ is_active })}
                  label="Active"
                  disabled={isSelf}
                />
                <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground/70">
                  {isSelf
                    ? 'You cannot deactivate your own account.'
                    : 'Inactive users cannot sign in; deactivating revokes any active sessions.'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={() => navigate('/users')}>
          Cancel
        </Button>
        <Button as="button" type="submit" loading={saving}>
          <Save className="h-4 w-4" />
          {isEdit ? 'Save changes' : 'Create user'}
        </Button>
      </div>
    </form>
  )
}
