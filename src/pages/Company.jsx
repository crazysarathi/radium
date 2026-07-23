import { ArrowRight } from 'lucide-react'
import { PageHero, Breadcrumb, Section, SectionHead, Button, DraftNotice, SplitText } from '@/components/ui'
import { stats } from '@/data/site'

const timeline = [
  { year: '20XX', title: 'Founded', body: 'PLACEHOLDER — the founding story and the problem the company was started to solve.' },
  { year: '20XX', title: 'First storage server shipped', body: 'PLACEHOLDER — the first Jupiter deployment and what it replaced.' },
  { year: '20XX', title: 'Line expanded to nine families', body: 'PLACEHOLDER — how the planet naming scheme and full stack came together.' },
  { year: '20XX', title: 'Certified Pre-Owned launched', body: 'PLACEHOLDER — the take-back and refurbishment programme.' },
]

const values = [
  { title: 'Specify honestly', body: 'PLACEHOLDER — a sizing that runs out in year three is a failure, even if it won the tender.' },
  { title: 'Build for service', body: 'PLACEHOLDER — every design decision judged by how it fails and how fast it is fixed.' },
  { title: 'Keep hardware in use', body: 'PLACEHOLDER — refurbishment as an engineering discipline, not a discount channel.' },
]

export default function Company() {
  return (
    <>
      <PageHero
        breadcrumb={<Breadcrumb trail={[{ label: 'Home', to: '/' }, { label: 'Company' }]} />}
        eyebrow="Company"
        title="About Radium"
        body="PLACEHOLDER — the positioning paragraph. Who Radium builds for, what the line covers, and why medical imaging hardware is specified differently from general-purpose IT."
      />

      <Section tight>
        <DraftNotice>Placeholder page — replace the copy, timeline and values below.</DraftNotice>

        <dl className="mt-10 grid gap-6 border-y border-white/[.07] py-10 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="reveal">
              <dt className="text-[34px] font-extrabold tracking-tight text-grad">{s.value}</dt>
              <dd className="mt-1 text-[11.5px] uppercase tracking-[.14em] text-muted-foreground/75">{s.label}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tight>
        <SectionHead eyebrow="How we work" title="Three things that decide every design" />
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="reveal glass glass-hover p-7">
              <h3 className="t-h3 text-foreground">{v.title}</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tight>
        <SectionHead eyebrow="History" title="Where the line came from" />
        <ol className="mt-10 space-y-0">
          {timeline.map((t, i) => (
            <li key={t.title} className="reveal relative grid gap-4 border-l border-white/[.1] pb-10 pl-8 md:grid-cols-[120px_1fr] md:gap-8">
              <span className="absolute left-0 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-beam shadow-glow" />
              {i === timeline.length - 1 && <span className="absolute bottom-0 left-0 h-10 w-px -translate-x-1/2 bg-[#0a0305]" />}
              <span className="font-mono text-[13px] font-bold text-beam/80">{t.year}</span>
              <div>
                <h3 className="text-[16px] font-bold text-foreground">{t.title}</h3>
                <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tight>
        <div className="reveal glass p-10 text-center md:p-14">
          <SplitText as="h2" gradient text="Work with us" className="t-h2 mx-auto max-w-xl" />
          <p className="mx-auto mt-4 max-w-lg text-[15px] text-muted-foreground">
            PLACEHOLDER — partner programme, distribution enquiries and careers copy.
          </p>
          <Button to="/contact" size="lg" className="mt-8">
            Get in touch <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Section>
    </>
  )
}
