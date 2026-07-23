import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'
import { PageHero, Breadcrumb, Section, Button, DraftNotice } from '@/components/ui'
import { products } from '@/data/products'

const inputCls =
  'w-full rounded-xl border border-white/10 bg-[#1a0709]/60 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-beam/60 focus:ring-2 focus:ring-beam/20'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e) => {
    // PLACEHOLDER — wire to your form backend (email service, CRM webhook, etc.)
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <PageHero
        breadcrumb={<Breadcrumb trail={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />}
        eyebrow="Contact"
        title="Request a quote"
        body="Tell us the workload — study volume, modality mix, retention period — and whether new or Certified Pre-Owned fits the budget. A configuration comes back, not a brochure."
      />

      <Section tight>
        <DraftNotice>
          Placeholder form — it does not submit anywhere yet. Wire{' '}
          <span className="font-mono text-foreground/80">onSubmit</span> in{' '}
          <span className="font-mono text-foreground/80">src/pages/Contact.jsx</span> to your backend, and
          replace the contact details in <span className="font-mono text-foreground/80">src/components/Footer.jsx</span>.
        </DraftNotice>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
          <div className="reveal glass p-8 md:p-10">
            {sent ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-12 w-12 text-beam" />
                <h2 className="t-h3 mt-5 text-foreground">Request received</h2>
                <p className="mt-3 max-w-sm text-[14px] text-muted-foreground">
                  PLACEHOLDER confirmation — nothing was actually sent. This is where the
                  response-time promise goes.
                </p>
                <Button type="button" variant="outline" className="mt-7" onClick={() => setSent(false)}>
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-foreground/80">Name</span>
                  <input required name="name" autoComplete="name" className={inputCls} placeholder="Your name" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-foreground/80">Organisation</span>
                  <input name="org" autoComplete="organization" className={inputCls} placeholder="Hospital / imaging centre / integrator" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-foreground/80">Email</span>
                  <input required type="email" name="email" autoComplete="email" className={inputCls} placeholder="you@example.com" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-foreground/80">Phone</span>
                  <input name="phone" autoComplete="tel" className={inputCls} placeholder="+91 …" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-foreground/80">Interested in</span>
                  <select name="interest" className={inputCls} defaultValue="">
                    <option value="" disabled>Select a product or programme…</option>
                    {products.filter((p) => p.status === 'available').map((p) => (
                      <option key={p.slug} value={p.slug}>{p.name} — {p.tagline}</option>
                    ))}
                    <option value="cpo">Certified Pre-Owned stock</option>
                    <option value="trade-in">Trade-in / buy-back</option>
                    <option value="support">Support contract</option>
                    <option value="other">Something else</option>
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-foreground/80">Requirement</span>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    className={inputCls}
                    placeholder="Annual study volume, modality mix, retention period, site count — whatever you know today."
                  />
                </label>
                <div className="sm:col-span-2">
                  <Button as="button" type="submit" size="lg">
                    Send request <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-4">
            {[
              { icon: MapPin, title: 'Head office', lines: ['PLACEHOLDER address line 1', 'Chennai, Tamil Nadu, India'] },
              { icon: Mail, title: 'Email', lines: ['sales@radium.example', 'support@radium.example'] },
              { icon: Phone, title: 'Phone', lines: ['+91 00000 00000 (sales)', '+91 00000 00001 (24×7 support)'] },
            ].map((c) => (
              <div key={c.title} className="reveal glass glass-hover flex items-start gap-4 p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-beam/25 bg-beam/10">
                  <c.icon className="h-4.5 w-4.5 text-beam" />
                </span>
                <div>
                  <h3 className="text-[14.5px] font-bold text-foreground">{c.title}</h3>
                  {c.lines.map((l) => (
                    <p key={l} className="mt-1 text-[13px] text-muted-foreground">{l}</p>
                  ))}
                </div>
              </div>
            ))}
            <div className="reveal glass p-6 text-[12.5px] leading-relaxed text-muted-foreground">
              PLACEHOLDER — office hours, regional distributor list, or a map embed.
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
