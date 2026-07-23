/**
 * Site-wide chrome: navigation, solution areas, support tiers, resources.
 * Pages marked PLACEHOLDER render dummy copy for later replacement.
 */

import { products } from './products'

export const nav = [
  {
    label: 'Products',
    to: '/products',
    mega: [
      {
        heading: 'Compute',
        items: products.filter((p) => p.category === 'compute').map((p) => ({ label: p.name, to: `/products/${p.slug}`, blurb: p.tagline, status: p.status })),
      },
      {
        heading: 'Storage',
        items: products.filter((p) => p.category === 'storage').map((p) => ({ label: p.name, to: `/products/${p.slug}`, blurb: p.tagline, status: p.status })),
      },
      {
        heading: 'Chassis',
        items: products.filter((p) => p.category === 'chassis').map((p) => ({ label: p.name, to: `/products/${p.slug}`, blurb: p.tagline, status: p.status })),
      },
      {
        heading: 'Workstations',
        items: products.filter((p) => p.category === 'workstation').map((p) => ({ label: p.name, to: `/products/${p.slug}`, blurb: p.tagline, status: p.status })),
      },
      {
        heading: 'Edge & IoMT',
        items: [
          ...products.filter((p) => p.category === 'edge').map((p) => ({ label: p.name, to: `/products/${p.slug}`, blurb: p.tagline, status: p.status })),
          { label: 'All products', to: '/products', blurb: 'Full line overview' },
          { label: 'Model numbers', to: '/products/jupiter#models', blurb: 'Jupiter SS decoder' },
        ],
      },
    ],
  },
  { label: 'Certified Pre-Owned', to: '/certified-pre-owned' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Support', to: '/support' },
  { label: 'Resources', to: '/resources' },
  { label: 'Company', to: '/company' },
]

export const solutions = [
  {
    slug: 'pacs',
    title: 'PACS',
    blurb: 'Compute, archive and reading endpoints sized as one system rather than three purchases.',
    stack: ['Mercury — application & database', 'Jupiter — primary archive', 'Neptune — diagnostic reading'],
  },
  {
    slug: 'vna',
    title: 'Vendor Neutral Archive',
    blurb: 'A retention tier that outlives the application in front of it, and grows a drive at a time.',
    stack: ['Jupiter — VNA object store', 'Io — capacity expansion', 'Mercury — VNA services'],
  },
  {
    slug: 'teleradiology',
    title: 'Teleradiology',
    blurb: 'Studies staged close to the reader, with the archive kept authoritative at the host site.',
    stack: ['Jupiter — staging & archive', 'Neptune / Mars — remote reading', 'Pluto — site gateway'],
  },
  {
    slug: 'ai-imaging',
    title: 'AI & Deep Learning',
    blurb: 'Inference either centrally on Mercury or pushed to the modality edge on Pluto.',
    stack: ['Mercury — GPU inference', 'Pluto — edge inference', 'Jupiter — training data store'],
  },
  {
    slug: 'iomt',
    title: 'IoMT & Connected Devices',
    blurb: 'Fanless gateways that bridge modalities onto the network and buffer through link loss.',
    stack: ['Pluto — device gateway', 'Saturn — departmental store', 'Mercury — aggregation'],
  },
  {
    slug: 'backup-dr',
    title: 'Backup & Disaster Recovery',
    blurb: 'A second copy on the same hardware family, so the recovery path is one you already run.',
    stack: ['Jupiter — backup target', 'Io — retention capacity', 'Saturn — remote-site copy'],
  },
]

export const supportTiers = [
  { name: 'Standard', response: 'Next business day', hours: '9×5', parts: 'NBD advance replacement', body: 'PLACEHOLDER — the baseline warranty that ships with every Radium system.' },
  { name: 'Enhanced', response: '4-hour response', hours: '24×7', parts: '4-hour parts delivery', body: 'PLACEHOLDER — for production archives where the reading room stops without them.' },
  { name: 'Mission Critical', response: '2-hour on-site', hours: '24×7', parts: 'On-site spares kit', body: 'PLACEHOLDER — named engineer, held spares, quarterly health review.' },
]

export const resources = [
  { type: 'Datasheet', title: 'Radium Jupiter SS — Storage Server', meta: 'PDF · 2.1 MB', tag: 'jupiter' },
  { type: 'Datasheet', title: 'Radium Mercury — High Performance Compute', meta: 'PDF · 1.8 MB', tag: 'mercury' },
  { type: 'Datasheet', title: 'Radium Io — Expansion Storage Pod', meta: 'PDF · 1.2 MB', tag: 'io' },
  { type: 'Guide', title: 'Model Number Reference — Storage Servers', meta: 'PDF · 640 KB', tag: 'jupiter' },
  { type: 'Guide', title: 'Sizing a PACS Archive for 7-Year Retention', meta: 'PDF · 3.4 MB', tag: 'solutions' },
  { type: 'White paper', title: 'SAN vs NAS for Medical Imaging Workloads', meta: 'PDF · 2.6 MB', tag: 'storage' },
  { type: 'Manual', title: 'Jupiter — Rack Installation & Cabling', meta: 'PDF · 5.1 MB', tag: 'jupiter' },
  { type: 'Manual', title: 'Io — Daisy-Chain Expansion Procedure', meta: 'PDF · 2.9 MB', tag: 'io' },
  { type: 'Compliance', title: 'NIST 800-88 Data Destruction Statement', meta: 'PDF · 410 KB', tag: 'cpo' },
]

export const stats = [
  { value: '12', label: 'Product families' },
  { value: '24', label: 'Bays per Jupiter chassis' },
  { value: '72h', label: 'CPO burn-in soak' },
  { value: '36mo', label: 'Max CPO warranty' },
]
