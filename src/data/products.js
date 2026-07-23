/**
 * Radium product catalogue.
 *
 * Source of truth for every product page on the site. Add a family here and it
 * shows up in the mega-nav, the product index and the compare table with no
 * other edits.
 *
 * Descriptive copy marked DRAFT is placeholder wording — replace it with the
 * approved marketing text. Model numbers and the families themselves come from
 * the official Radium line sheet.
 */

import { chassisModels } from './chassis'

/* ------------------------------------------------------------------ */
/* Jupiter SS model numbers                                            */
/* ------------------------------------------------------------------ */

/**
 * Storage Server (SAN / NAS) model number scheme:
 *   first two digits  – number of bays
 *   second two digits – drive capacity (TB)
 *   last two digits   – drives installed
 *
 * So `Jupiter SS 161620` = 16 bays, 16 TB drives, 20 installed... which is why
 * we validate: installed can never exceed bays.
 */
export const decodeModelNumber = (code) => {
  const digits = String(code).replace(/\D/g, '')
  if (digits.length !== 6) return null
  const bays = parseInt(digits.slice(0, 2), 10)
  const driveCapacityTb = parseInt(digits.slice(2, 4), 10)
  const drivesInstalled = parseInt(digits.slice(4, 6), 10)
  return {
    bays,
    driveCapacityTb,
    drivesInstalled,
    rawCapacityTb: driveCapacityTb * drivesInstalled,
    baysFree: bays - drivesInstalled,
    valid: drivesInstalled <= bays,
  }
}

/** Official SKUs from the Radium line sheet. Add new codes to this array only. */
const JUPITER_SS_CODES = [
  '160808',
  '161608',
  '160816',
  '161616',
  '160820',
  '161620',
  '242016',
  '242416',
  '242020',
]

/** Chassis rack units, keyed by bay count. */
const RACK_UNITS = { 16: '3U', 24: '4U', 36: '4U', 60: '4U' }

export const jupiterModels = JUPITER_SS_CODES.map((code) => {
  const d = decodeModelNumber(code)
  return {
    id: `jupiter-ss-${code}`,
    code,
    name: `Jupiter SS ${code}`,
    family: 'jupiter',
    rackUnits: RACK_UNITS[d.bays] ?? '4U',
    ...d,
  }
})

/* ------------------------------------------------------------------ */
/* Product families                                                    */
/* ------------------------------------------------------------------ */

export const categories = [
  { key: 'compute', label: 'Compute', blurb: 'Application and database servers' },
  { key: 'storage', label: 'Storage', blurb: 'SAN / NAS servers and expansion' },
  { key: 'chassis', label: 'Chassis', blurb: 'Server, industrial PC and ES1 chassis' },
  { key: 'workstation', label: 'Workstations', blurb: 'Reading and reporting desktops' },
  { key: 'edge', label: 'Edge & IoMT', blurb: 'Connected medical devices' },
]

export const products = [
  {
    slug: 'mercury',
    name: 'Radium Mercury',
    series: 'Mercury',
    tagline: 'High performance computers',
    category: 'compute',
    status: 'available',
    note: 'For use with PACS & VNA',
    formFactor: '1U / 2U rackmount',
    // DRAFT copy
    summary:
      'Mercury is the compute tier of a Radium imaging stack — the machine that runs the PACS application, the DICOM router, the worklist database and the AI inference queue. Dual-socket, heavily cached and built to keep study retrieval flat while the archive grows underneath it.',
    highlights: [
      { title: 'Dual-socket Intel or AMD', body: 'Up to 128 cores per node for concurrent study rendering and inference.' },
      { title: 'Memory-first design', body: 'Up to 4 TB DDR5 so the hot study cache lives in RAM, not on disk.' },
      { title: 'NVMe scratch tier', body: 'Front-serviced U.2 bays for the working set ahead of the Jupiter archive.' },
      { title: 'Redundant everything', body: 'Dual power, hot-swap fans, out-of-band management on a dedicated port.' },
    ],
    applications: ['PACS application server', 'VNA services', 'DICOM routing', 'AI / deep-learning inference', 'Reporting & worklist database'],
    specs: [
      { group: 'Processor', rows: [['Sockets', 'Dual'], ['CPU options', 'Intel Xeon Scalable / AMD EPYC'], ['Max cores', 'Up to 128 per node']] },
      { group: 'Memory', rows: [['Type', 'DDR5 ECC RDIMM'], ['Slots', '32 DIMM'], ['Max capacity', 'Up to 4 TB']] },
      { group: 'Storage', rows: [['Front bays', '8–24 hot-swap'], ['Media', 'NVMe U.2 / SAS SSD / SATA'], ['Boot', 'Redundant M.2 mirrored pair']] },
      { group: 'Networking', rows: [['Onboard', '2 × 10GbE'], ['Options', '25 / 40 / 100 GbE add-in'], ['Management', 'Dedicated IPMI / BMC port']] },
      { group: 'Chassis', rows: [['Form factor', '1U / 2U rackmount'], ['Power', 'Redundant hot-swap PSU'], ['Cooling', 'Hot-swap redundant fans']] },
    ],
  },
  {
    slug: 'jupiter',
    name: 'Radium Jupiter',
    series: 'Jupiter',
    tagline: 'Storage Server',
    category: 'storage',
    status: 'available',
    note: 'SAN / NAS, Intel / AMD CPU',
    formFactor: '3U / 4U rackmount',
    hasModels: true,
    summary:
      'Jupiter is the archive. A full server — not an appliance — running SAN and NAS services on Intel or AMD silicon, sized by a six-digit model number that tells you the bay count, the drive size and how many drives shipped installed. Start part-populated and fill the chassis as the archive grows.',
    highlights: [
      { title: 'SAN and NAS in one head', body: 'Block and file services from a single controller — iSCSI, NFS and SMB together.' },
      { title: 'Buy the bays, fill them later', body: 'Model numbers encode installed drives separately from bay count. Expansion is a drive, not a migration.' },
      { title: 'Scales out with Io', body: 'Attach Radium Io expansion pods to grow past the head unit without touching the host.' },
      { title: 'Intel or AMD', body: 'Same chassis, same services, CPU chosen to match the site standard.' },
    ],
    applications: ['PACS primary archive', 'VNA object store', 'Long-term DICOM retention', 'Backup target', 'Teleradiology staging'],
    specs: [
      { group: 'Controller', rows: [['CPU', 'Intel Xeon / AMD EPYC'], ['Memory', 'DDR5 ECC, expandable'], ['Cache', 'NVMe read/write cache tier']] },
      { group: 'Storage', rows: [['Bays', '16 or 24 hot-swap (see model table)'], ['Media', '3.5" SAS / SATA enterprise HDD'], ['Drive sizes', '8 / 16 / 20 / 24 TB'], ['RAID', 'Hardware RAID with battery-backed cache']] },
      { group: 'Protocols', rows: [['Block', 'iSCSI, Fibre Channel (option)'], ['File', 'NFS, SMB/CIFS'], ['Object', 'S3-compatible gateway (option)']] },
      { group: 'Networking', rows: [['Onboard', '2 × 10GbE'], ['Options', '25 / 40 / 100 GbE'], ['Management', 'Dedicated BMC port']] },
      { group: 'Chassis', rows: [['Form factor', '3U (16-bay) / 4U (24-bay)'], ['Power', 'Redundant hot-swap PSU'], ['Expansion', 'SAS ports for Radium Io pods']] },
    ],
  },
  {
    slug: 'io',
    name: 'Radium Io',
    series: 'Io',
    tagline: 'Expansion Storage pods for Radium Jupiter',
    category: 'storage',
    status: 'available',
    note: 'For use with PACS & VNA',
    formFactor: '4U JBOD',
    summary:
      'Io is capacity without another controller. A dense SAS expansion pod that attaches to a Jupiter head unit and presents its drives as part of the same pool — the archive gets bigger, the host sees the same volume, and nothing gets migrated.',
    highlights: [
      { title: 'Daisy-chain to grow', body: 'Multiple pods per Jupiter head, added while the array stays online.' },
      { title: 'No second controller', body: 'Capacity scales without another OS to patch, licence or monitor.' },
      { title: 'Dense by design', body: 'High bay count per rack unit for archives measured in petabytes.' },
      { title: 'Redundant SAS paths', body: 'Dual expanders and dual power so a single path failure is not an outage.' },
    ],
    applications: ['Archive capacity expansion', 'Long-term DICOM retention', 'Backup and DR staging'],
    specs: [
      { group: 'Enclosure', rows: [['Type', 'SAS JBOD expansion'], ['Bays', 'High-density 3.5" hot-swap'], ['Expanders', 'Dual redundant']] },
      { group: 'Connectivity', rows: [['Host interface', 'SAS to Radium Jupiter'], ['Topology', 'Daisy-chain, multiple pods per head']] },
      { group: 'Chassis', rows: [['Form factor', '4U rackmount'], ['Power', 'Redundant hot-swap PSU'], ['Cooling', 'Hot-swap redundant fans']] },
    ],
  },
  {
    slug: 'saturn',
    name: 'Radium Saturn',
    series: 'Saturn',
    tagline: 'Storage Server',
    category: 'storage',
    status: 'available',
    note: 'SAN / NAS — embedded / QSAN rebranded',
    formFactor: '2U / 3U appliance',
    summary:
      'Saturn is the appliance answer where Jupiter is the server answer. An embedded SAN/NAS platform built on a QSAN base and delivered under Radium support — a fixed, hardened firmware stack for sites that want storage to be a box, not a system to administer.',
    highlights: [
      { title: 'Embedded controller', body: 'Purpose-built storage firmware rather than a general-purpose OS.' },
      { title: 'Fast to stand up', body: 'Web-managed, opinionated defaults, in production the same day.' },
      { title: 'Unified block and file', body: 'iSCSI, NFS and SMB from one appliance.' },
      { title: 'Radium-supported', body: 'QSAN platform, Radium warranty, Radium escalation path.' },
    ],
    applications: ['Departmental PACS storage', 'Modality store-and-forward', 'Small-site VNA', 'Backup target'],
    specs: [
      { group: 'Platform', rows: [['Base', 'QSAN, rebranded and supported by Radium'], ['Controller', 'Embedded storage firmware'], ['Availability', 'Single or dual controller']] },
      { group: 'Storage', rows: [['Media', 'SAS / SATA HDD and SSD'], ['RAID', 'Hardware RAID with SSD cache'], ['Snapshots', 'Scheduled, space-efficient']] },
      { group: 'Protocols', rows: [['Block', 'iSCSI, Fibre Channel (model dependent)'], ['File', 'NFS, SMB/CIFS']] },
      { group: 'Chassis', rows: [['Form factor', '2U / 3U rackmount'], ['Power', 'Redundant hot-swap PSU']] },
    ],
  },
  {
    slug: 'neptune',
    name: 'Radium Neptune',
    series: 'Neptune',
    tagline: 'Desktop systems',
    category: 'workstation',
    status: 'available',
    note: 'Diagnostic reading and reporting',
    formFactor: 'Tower / small form factor',
    summary:
      'Neptune is where the study gets read. A full-size diagnostic desktop with the GPU headroom to drive multi-head diagnostic displays, enough local NVMe to hold a working list, and a quiet enough thermal design to sit in a reading room.',
    highlights: [
      { title: 'Multi-display capable', body: 'Drives paired diagnostic greyscale panels plus a colour worklist monitor.' },
      { title: 'GPU headroom', body: 'Full-height card support for 3D, MPR and reconstruction workloads.' },
      { title: 'Quiet under load', body: 'Reading-room acoustics rather than server-room acoustics.' },
      { title: 'Serviceable', body: 'Tool-less access, standard parts, no proprietary trays.' },
    ],
    applications: ['Diagnostic reading', 'Reporting workstations', '3D / MPR post-processing', 'Technologist QA'],
    specs: [
      { group: 'Processor', rows: [['CPU', 'Intel Core / AMD Ryzen'], ['Configuration', 'Single socket']] },
      { group: 'Memory', rows: [['Type', 'DDR5'], ['Capacity', 'Up to 128 GB']] },
      { group: 'Graphics', rows: [['Support', 'Full-height, full-length discrete GPU'], ['Outputs', 'Multi-head diagnostic display support']] },
      { group: 'Storage', rows: [['Boot', 'NVMe M.2'], ['Local cache', 'Additional NVMe / SATA bays']] },
      { group: 'Chassis', rows: [['Form factor', 'Tower'], ['Access', 'Tool-less side panel']] },
    ],
  },
  {
    slug: 'mars',
    name: 'Radium Mars',
    series: 'Mars',
    tagline: 'Small Desktop systems',
    category: 'workstation',
    status: 'available',
    note: 'Compact clinical endpoints',
    formFactor: 'Mini / ultra-small form factor',
    summary:
      'Mars is Neptune with the tower removed. A compact endpoint for consultation rooms, technologist stations, ward carts and anywhere the desk has no space under it — same imaging client, a fraction of the footprint.',
    highlights: [
      { title: 'Fits anywhere', body: 'VESA-mountable behind a display or under a counter.' },
      { title: 'Low power, low noise', body: 'Suitable for consult rooms and clinical areas.' },
      { title: 'Fleet-friendly', body: 'One image, one BIOS baseline, deployed across every room.' },
      { title: 'Dual display out of the box', body: 'Worklist and viewer without an adapter.' },
    ],
    applications: ['Clinical review stations', 'Technologist workstations', 'Consultation rooms', 'Front-office / registration'],
    specs: [
      { group: 'Processor', rows: [['CPU', 'Intel Core / AMD Ryzen mobile-class'], ['Configuration', 'Single socket']] },
      { group: 'Memory', rows: [['Type', 'DDR5 SODIMM'], ['Capacity', 'Up to 64 GB']] },
      { group: 'Storage', rows: [['Boot', 'NVMe M.2'], ['Secondary', 'Optional 2.5" SATA']] },
      { group: 'Chassis', rows: [['Form factor', 'Mini / USFF'], ['Mounting', 'VESA bracket included']] },
    ],
  },
  {
    slug: 'pluto',
    name: 'Radium Pluto',
    series: 'Pluto',
    tagline: 'IoMT',
    category: 'edge',
    status: 'available',
    note: 'Internet of Medical Things',
    formFactor: 'Fanless edge / DIN mount',
    summary:
      'Pluto is the edge tier — small, fanless, sealed compute that lives next to the modality rather than in the data centre. It bridges devices onto the network, buffers when the link drops, and runs inference where the data is created.',
    highlights: [
      { title: 'Fanless and sealed', body: 'No moving parts, no intake filter, no service visit for dust.' },
      { title: 'Store and forward', body: 'Buffers locally when the network drops and reconciles on reconnect.' },
      { title: 'Edge inference', body: 'Runs models beside the modality instead of shipping every study upstream.' },
      { title: 'Wide input power', body: 'DIN rail, VESA or wall mount with wide-range DC input.' },
    ],
    applications: ['Modality gateways', 'DICOM store-and-forward', 'Edge AI inference', 'Device telemetry', 'Remote / mobile imaging units'],
    specs: [
      { group: 'Processor', rows: [['CPU', 'Low-power Intel / ARM class'], ['Cooling', 'Fanless passive']] },
      { group: 'Memory & storage', rows: [['Memory', 'Up to 32 GB'], ['Storage', 'Industrial NVMe / eMMC']] },
      { group: 'Connectivity', rows: [['Network', 'Dual GbE'], ['Wireless', 'Wi-Fi / LTE module options'], ['I/O', 'Serial, USB, GPIO']] },
      { group: 'Environment', rows: [['Mounting', 'DIN rail / VESA / wall'], ['Power', 'Wide-range DC input'], ['Operating range', 'Extended temperature']] },
    ],
  },
  {
    slug: 'server-chassis',
    name: 'Server Chassis',
    series: 'RSC',
    tagline: 'Rackmount server storage chassis',
    category: 'chassis',
    status: 'available',
    note: `${chassisModels['server-chassis'].length} models · 1U – 4U`,
    formFactor: '1U – 4U rackmount',
    hasModels: true,
    // DRAFT copy
    summary:
      'The enclosures the rack tiers are built in. Storage-optimised rackmount chassis from 1U to 4U — EATX motherboard support, tool-less hot-swap bays from 4 to 60 drives, tri-mode SAS/SATA/NVMe backplane options and redundant hot-swap power throughout. Buy them bare for integration, or as the platform behind a configured Radium system.',
    highlights: [
      { title: '1U to 4U, short-depth options', body: 'Full-depth 26.8" – 37.4" chassis plus 22" short-depth models for shallow racks.' },
      { title: 'Up to 60 hot-swap bays', body: 'From 4 × 3.5" in 1U to 60 × 3.5" top-load in 4U, all tool-less carriers.' },
      { title: 'Tri-mode backplanes', body: 'T3 models take SAS, SATA or NVMe U.2 in the same bay, PCIe Gen4 switched.' },
      { title: 'Redundant power', body: '1+1 and 2+2 hot-swap PSU options from 300 W to 1600 W.' },
    ],
    applications: ['System integration & OEM builds', 'Storage server platforms', 'PACS archive nodes', 'Backup & DR targets', 'Custom rack deployments'],
    specs: [
      { group: 'Form factor', rows: [['Rack units', '1U / 2U / 3U / 4U'], ['Depth', '22" short to 37.4" (model dependent)'], ['Standard', '19" EIA-310 rackmount']] },
      { group: 'Motherboard support', rows: [['Board sizes', 'ATX / EATX (model dependent)'], ['Expansion', 'Full-height and low-profile slot layouts']] },
      { group: 'Drive bays', rows: [['3.5" hot-swap', 'Up to 60 bays (RSC-4H / 4H1)'], ['2.5" hot-swap', 'Up to 24 bays (RSC-2AT / 2AT3)'], ['Backplane', 'SAS / SATA, tri-mode NVMe on T3 models']] },
      { group: 'Power', rows: [['PSU range', '300 W – 1600 W'], ['Redundancy', 'Single, 1+1 or 2+2 hot-swap redundant']] },
    ],
  },
  {
    slug: 'industrial-pc',
    name: 'Industrial PC',
    series: 'RMC',
    tagline: 'Industrial rackmount PC chassis',
    category: 'chassis',
    status: 'available',
    note: `${chassisModels['industrial-pc'].length} models · 1U – 4U`,
    formFactor: '1U – 4U rackmount',
    hasModels: true,
    // DRAFT copy
    summary:
      'Industrial rackmount PC chassis for the machines that sit next to the modality, the control desk and the plant floor rather than in the data centre. Short-depth 1U to 4U enclosures with external 5.25" and 3.5" bays for legacy media, single or redundant power, and the mounting hardware to live in a wall cabinet.',
    highlights: [
      { title: 'Short-depth builds', body: '15" – 20" chassis depth fits wall cabinets and shallow control-room racks.' },
      { title: 'Legacy media bays', body: 'External 5.25" and 3.5" bays for the drives industrial software still ships on.' },
      { title: 'Flexible power', body: 'FLEX, PS2 and CRPS options — single supplies or redundant where uptime matters.' },
      { title: 'Industrial duty', body: 'Filtered intakes and locking front doors on selected models.' },
    ],
    applications: ['Modality consoles & control PCs', 'Industrial automation hosts', 'Kiosk & instrument computing', 'Lab equipment controllers'],
    specs: [
      { group: 'Form factor', rows: [['Rack units', '1U / 2U / 3U / 4U'], ['Depth', '15" – 20" (model dependent)'], ['Standard', '19" EIA-310 rackmount']] },
      { group: 'Drive bays', rows: [['External', 'Up to 6 × 5.25" + 3.5" combinations'], ['Internal', '2.5" / 3.5" fixed mounts'], ['Hot-swap', 'External 2.5" trays on selected models']] },
      { group: 'Power', rows: [['PSU range', '250 W – 800 W'], ['Options', 'FLEX / PS2 / CRPS, single or redundant']] },
    ],
  },
  {
    slug: 'es1-chassis',
    name: 'ES1 Server Chassis',
    series: 'ES1',
    tagline: 'Tool-free 2U server chassis',
    category: 'chassis',
    status: 'available',
    note: `${chassisModels['es1-chassis'].length} models · 2U`,
    formFactor: '2U rackmount',
    hasModels: true,
    // DRAFT copy
    summary:
      'The ES1 series is the current-generation 2U platform: a tool-free chassis where drive trays, fan walls and backplanes service without a screwdriver. EATX+ motherboard support up to 12.8" × 14" including shadow-CPU layouts, closed-loop liquid cooling clearance, and 8 or 12 hot-swap bays with power options to 2000 W redundant.',
    highlights: [
      { title: 'Tool-free serviceability', body: 'Drive trays, fan modules and backplanes swap without tools or downtime.' },
      { title: 'EATX+ board support', body: 'Boards up to 12.8" × 14" including dual-socket shadow-CPU layouts.' },
      { title: 'Liquid-cooling ready', body: 'Clearance for closed-loop liquid cooling on high-TDP processors.' },
      { title: 'Up to 2000 W redundant', body: 'PSU options from 550 W to 2000 W, all hot-swap redundant.' },
    ],
    applications: ['Current-gen server builds', 'High-TDP CPU platforms', 'Storage-dense 2U systems', 'OEM / ODM programmes'],
    specs: [
      { group: 'Form factor', rows: [['Rack units', '2U'], ['Depth', '28.3"'], ['Standard', '19" EIA-310 rackmount']] },
      { group: 'Motherboard support', rows: [['Board sizes', 'Up to EATX+ 12.8" × 14"'], ['CPU layout', 'Standard and shadow-CPU, liquid-cooling clearance']] },
      { group: 'Drive bays', rows: [['Front', '8 or 12 × 3.5"/2.5" tool-less hot-swap'], ['Rear', '2 × 2.5" hot-swap (E0 models)']] },
      { group: 'Cooling', rows: [['Fans', '8038 PWM fan wall'], ['Hot-swap', '(3+1) hot-swap fan module on E0 models']] },
      { group: 'Power', rows: [['PSU range', '550 W – 2000 W'], ['Redundancy', 'Hot-swap redundant']] },
    ],
  },
  {
    slug: 'uranus',
    name: 'Radium Uranus',
    series: 'Uranus',
    tagline: 'For future use',
    category: 'compute',
    status: 'roadmap',
    note: 'Reserved',
    formFactor: 'TBD',
    summary:
      'Reserved in the Radium naming scheme. Positioning, form factor and specification are not yet published — talk to us if you have a requirement the current line does not cover.',
    highlights: [],
    applications: [],
    specs: [],
  },
  {
    slug: 'venus',
    name: 'Radium Venus',
    series: 'Venus',
    tagline: 'For future use',
    category: 'workstation',
    status: 'roadmap',
    note: 'Reserved',
    formFactor: 'TBD',
    summary:
      'Reserved in the Radium naming scheme. Positioning, form factor and specification are not yet published — talk to us if you have a requirement the current line does not cover.',
    highlights: [],
    applications: [],
    specs: [],
  },
]

export const getProduct = (slug) => products.find((p) => p.slug === slug)
export const getModel = (code) => jupiterModels.find((m) => m.code === code)

/** AIC-style terse spec bullets for a product card (form factor + key rows). */
export const cardBullets = (product) => {
  if (!product) return []
  // Keep the label when the value alone is too terse to stand on its own.
  const label = (name, value) => {
    const v = String(value)
    return v.length <= 5 || /^[\d.]+$/.test(v) ? `${name}: ${v}` : v
  }
  const out = []
  const push = (s) => {
    if (s && !out.some((x) => x.toLowerCase() === s.toLowerCase())) out.push(s)
  }
  push(product.formFactor)
  push(product.note)
  ;(product.specs || []).forEach((g) => {
    const first = g.rows?.[0]
    if (out.length < 5 && first) push(label(first[0], first[1]))
  })
  return out.slice(0, 5)
}

/** Human label for a category key. */
export const categoryLabel = (key) => categories.find((c) => c.key === key)?.label ?? key
export const availableProducts = products.filter((p) => p.status === 'available')
export const productsByCategory = (key) => products.filter((p) => p.category === key)

/* ------------------------------------------------------------------ */
/* AIC-style specification depth                                       */
/* ------------------------------------------------------------------ */

/**
 * Shared spec groups appended to every product so each detail page carries the
 * same category depth AIC publishes (management, redundancy, electrical &
 * environmental, physical, regulatory) on top of the family-specific groups.
 * Values are indicative pending the approved datasheet.
 */
const variantOf = (p) => {
  if (p.category === 'workstation') return p.slug === 'mars' ? 'mini' : 'tower'
  if (p.category === 'edge') return 'edge'
  return 'rack'
}

const PHYSICAL = {
  rack: {
    group: 'Physical',
    rows: [
      ['Form factor', '19" rackmount (EIA-310)'],
      ['Chassis depth', '700 – 900 mm (model dependent)'],
      ['Width', '448 mm (19" rack)'],
      ['Weight', 'Configuration dependent'],
    ],
  },
  tower: {
    group: 'Physical',
    rows: [
      ['Form factor', 'Pedestal tower'],
      ['Dimensions (H×W×D)', '≈ 440 × 200 × 500 mm'],
      ['Weight', '≈ 15 – 20 kg'],
    ],
  },
  mini: {
    group: 'Physical',
    rows: [
      ['Form factor', 'Mini / ultra-small form factor'],
      ['Dimensions (H×W×D)', '≈ 180 × 180 × 40 mm'],
      ['Mounting', 'VESA bracket included'],
      ['Weight', '≈ 1.5 kg'],
    ],
  },
  edge: {
    group: 'Physical',
    rows: [
      ['Form factor', 'Fanless edge, sealed'],
      ['Dimensions (H×W×D)', '≈ 55 × 200 × 150 mm'],
      ['Mounting', 'DIN rail / VESA / wall'],
      ['Weight', '≈ 1.8 kg'],
    ],
  },
}

const G = {
  management: {
    group: 'Management',
    rows: [
      ['BMC', 'ASPEED AST2600 baseboard management controller'],
      ['Out-of-band', 'Dedicated RJ45, IPMI 2.0 / Redfish'],
      ['Remote console', 'HTML5 KVM-over-IP with virtual media'],
      ['Monitoring', 'Voltage, temperature, fan, PSU and chassis-intrusion'],
    ],
  },
  managementEdge: {
    group: 'Management',
    rows: [
      ['Device management', 'Cloud / fleet management agent'],
      ['Security', 'TPM 2.0, secure boot'],
      ['Reliability', 'Hardware watchdog timer'],
    ],
  },
  redundancy: {
    group: 'Hot-Swap & Redundancy',
    rows: [
      ['Drive bays', 'Tool-less hot-swap drive carriers'],
      ['Power', 'Redundant hot-swap PSU (1+1 / 2+2)'],
      ['Cooling', 'Hot-swap redundant fan modules'],
      ['Efficiency', '80 PLUS Platinum / Titanium'],
    ],
  },
  envServer: {
    group: 'Electrical & Environmental',
    rows: [
      ['AC input', '100 – 240 V, 50/60 Hz auto-ranging'],
      ['Operating temperature', '10 °C – 35 °C'],
      ['Non-operating temperature', '-40 °C – 70 °C'],
      ['Relative humidity', '8% – 90% non-condensing'],
    ],
  },
  envEdge: {
    group: 'Electrical & Environmental',
    rows: [
      ['DC input', '9 – 36 V wide-range DC'],
      ['Operating temperature', '-20 °C – 60 °C (extended range)'],
      ['Relative humidity', '5% – 95% non-condensing'],
      ['Shock / vibration', 'MIL-STD-810G tested'],
    ],
  },
  envDesktop: {
    group: 'Electrical & Environmental',
    rows: [
      ['AC input', '100 – 240 V, 50/60 Hz'],
      ['Operating temperature', '10 °C – 35 °C'],
      ['Acoustics', 'Reading-room rated low-noise thermal design'],
    ],
  },
  regulatory: {
    group: 'Regulatory & Compliance',
    rows: [
      ['Safety', 'CE, UL / cUL, CB'],
      ['EMC', 'FCC Class A, CE'],
      ['Environmental', 'RoHS, REACH, WEEE'],
    ],
  },
}

/** The AIC-style groups that get appended after a product's own spec groups. */
export const commonSpecs = (product) => {
  if (!product) return []
  const extra = []
  if (product.category === 'compute' || product.category === 'storage') {
    extra.push(G.management, G.redundancy, G.envServer)
  } else if (product.category === 'chassis') {
    // Bare enclosures — no BMC to manage, but the same redundancy story.
    extra.push(G.redundancy, G.envServer)
  } else if (product.category === 'edge') {
    extra.push(G.managementEdge, G.envEdge)
  } else {
    extra.push(G.envDesktop)
  }
  extra.push(PHYSICAL[variantOf(product)], G.regulatory)
  return extra
}

/** Full detail-page spec table: the family's own groups + the shared AIC groups. */
export const getFullSpecs = (product) => {
  if (!product?.specs?.length) return []
  return [...product.specs, ...commonSpecs(product)]
}
