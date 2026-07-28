import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, KeyRound, LogIn } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { DEMO_CREDENTIALS } from '@/services/auth'
import { Button, Field, Input } from '@/components/ui'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const from = location.state?.from?.pathname ?? '/'

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px] animate-fade-up">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src="/radium-logo-dark.svg" alt="Radium" className="h-11 w-auto" />
          <p className="t-eyebrow mt-5 text-beam/70">Admin console</p>
          <h1 className="t-h2 mt-2 text-grad">Sign in to manage the site</h1>
        </div>

        <form onSubmit={onSubmit} className="glass space-y-5 p-7 shadow-card md:p-8">
          <Field label="Email" required>
            <Input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@radium.example"
              required
              autoFocus
            />
          </Field>

          <Field label="Password" required error={error}>
            <div className="relative">
              <Input
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          <Button as="button" type="submit" size="lg" loading={busy} className="w-full">
            {busy ? 'Signing in…' : 'Sign in'}
            {!busy && <LogIn className="h-4 w-4" />}
          </Button>

          <div className="rounded-xl border border-beam/20 bg-beam/[.06] p-4">
            <p className="flex items-center gap-2 text-[12px] font-semibold text-beam">
              <KeyRound className="h-3.5 w-3.5" />
              Demo credentials (mock auth)
            </p>
            <p className="mt-2 font-mono text-[12px] leading-relaxed text-foreground/85">
              {DEMO_CREDENTIALS.email}
              <br />
              {DEMO_CREDENTIALS.password}
            </p>
          </div>
        </form>

        <p className="mt-6 text-center text-[12px] text-muted-foreground">
          Session is stored locally. No backend, no cookies, no tracking.
        </p>
      </div>
    </div>
  )
}
