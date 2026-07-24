import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'
import { products } from '@/data/products'
import { solutions } from '@/data/site'

const year = new Date().getFullYear()

export default function Footer() {
  const cols = [
    {
      heading: 'Products',
      links: products
        .filter((p) => p.status === 'available')
        .map((p) => ({ label: p.name.replace('Radium ', ''), to: `/products/${p.slug}` })),
    },
    {
      heading: 'Solutions',
      links: solutions.map((s) => ({ label: s.title, to: `/solutions#${s.slug}` })),
    },
    {
      heading: 'Buy',
      links: [
        { label: 'Request a quote', to: '/contact' },
        { label: 'Model number guide', to: '/products/jupiter#models' },
        { label: 'Datasheets', to: '/resources' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About Radium', to: '/company' },
        { label: 'Resources', to: '/resources' },
        { label: 'Contact', to: '/contact' },
      ],
    },
  ]

  return (
    <footer className="relative mt-8 border-t border-white/[.07] bg-[#0a0305]/60">
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2.4fr]">
          <div>
            <img src="/radium-logo-dark.svg" alt="Radium" className="h-10 w-auto" width="220" height="70" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Compute, storage and edge hardware engineered for PACS, VNA and enterprise medical imaging.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-beam/70" />
                <span>Chennai, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-beam/70" />
                <a href="mailto:sales@radium.example" className="hover:text-beam">sales@radium.example</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-beam/70" />
                <a href="tel:+910000000000" className="hover:text-beam">+91 00000 00000</a>
              </li>
            </ul>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {cols.map((col) => (
              <div key={col.heading}>
                <h4 className="t-eyebrow mb-4 text-beam/70">{col.heading}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-[13.5px] text-muted-foreground transition-colors hover:text-foreground">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col gap-4 text-[12.5px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Radium. Radium® is a registered trademark. All specifications subject to change.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/company" className="hover:text-foreground">Privacy</Link>
            <Link to="/company" className="hover:text-foreground">Terms</Link>
            
          </div>
        </div>
      </div>
    </footer>
  )
}
