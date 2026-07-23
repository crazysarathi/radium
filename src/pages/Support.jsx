import { LifeBuoy, Clock, Truck, PhoneCall, ArrowRight } from 'lucide-react'
import { PageHero, Breadcrumb, Section, SectionHead, Button, DraftNotice, Badge, SplitText } from '@/components/ui'
import { supportTiers } from '@/data/site'

const faqs = [
  { q: 'How long is hardware supported after end of sale?', a: 'PLACEHOLDER — state the support and spares commitment window here.' },
  { q: 'Do you support mixed new and Certified Pre-Owned racks?', a: 'PLACEHOLDER — describe how CPO units join an existing support contract.' },
  { q: 'What happens to a failed drive containing patient data?', a: 'PLACEHOLDER — describe the non-return-of-drive option and destruction certificate.' },
  { q: 'Can we hold our own spares on site?', a: 'PLACEHOLDER — describe the on-site spares kit and replenishment process.' },
  { q: 'How are firmware updates delivered?', a: 'PLACEHOLDER — describe the qualified baseline and update cadence.' },
]

export default function Support() {
  return (
    <>
      <PageHero
        breadcrumb={<Breadcrumb trail={[{ label: 'Home', to: '/' }, { label: 'Support' }]} />}
        eyebrow="Support"
        title="The archive does not get to have a bad day"
        body="Three service levels, one escalation path, and the same engineers for new and Certified Pre-Owned hardware."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/contact" size="lg">Open a support request <ArrowRight className="h-4 w-4" /></Button>
          <Button to="/resources" variant="outline" size="lg">Manuals & downloads</Button>
        </div>
      </PageHero>

      <Section tight>
        <DraftNotice>
          Placeholder page. Service-level terms live in{' '}
          <span className="font-mono text-foreground/80">src/data/site.js</span> →{' '}
          <span className="font-mono text-foreground/80">supportTiers</span>.
        </DraftNotice>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {supportTiers.map((t, i) => (
            <div
              key={t.name}
              className={
                'reveal glass glass-hover flex flex-col p-7 ' +
                (i === 1 ? 'border-beam/40 shadow-glow' : '')
              }
            >
              {i === 1 && <Badge className="mb-4 self-start">Most deployed</Badge>}
              <h3 className="t-h3 text-foreground">{t.name}</h3>
              <dl className="mt-5 space-y-3 border-y border-white/[.06] py-5">
                {[
                  [Clock, 'Response', t.response],
                  [PhoneCall, 'Coverage', t.hours],
                  [Truck, 'Parts', t.parts],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-beam/70" />
                    <div>
                      <dt className="text-[11px] uppercase tracking-[.13em] text-muted-foreground/85">{label}</dt>
                      <dd className="text-[13.5px] text-foreground/90">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <p className="mt-5 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">{t.body}</p>
              <Button to="/contact" variant={i === 1 ? 'primary' : 'outline'} size="sm" className="mt-6">
                Enquire
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section tight>
        <SectionHead eyebrow="Common questions" title="Support FAQ" />
        <div className="reveal glass mt-9 divide-y divide-white/[.06]">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6 py-5 md:px-8">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-foreground marker:content-none">
                {f.q}
                <span className="shrink-0 text-beam transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section tight>
        <div className="reveal glass flex flex-col items-center gap-5 p-10 text-center md:p-14">
          <LifeBuoy className="h-9 w-9 text-beam" />
          <SplitText as="h2" gradient text="Something down right now?" className="t-h2 max-w-xl" />
          <p className="max-w-lg text-[15px] text-muted-foreground">
            PLACEHOLDER — put the 24×7 emergency line and the support portal link here.
          </p>
          <Button to="/contact" size="lg">Contact support</Button>
        </div>
      </Section>
    </>
  )
}
