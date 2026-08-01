/**
 * Pure catalogue helpers — operate on API data passed in by the caller (a
 * product, a jupiter model, an image list). None of these import catalogue
 * data themselves; the live arrays live in `CatalogueContext`, fetched from
 * the backend. Kept framework-free so they're trivial to unit test.
 */

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

/**
 * The API only carries `code` — for variants that have one (storage-server
 * SKUs), spread the decoded fields onto the fetched record. Variants without
 * a code (named chassis/server models) pass through untouched.
 */
export const augmentVariant = (m) => (m.code ? { ...m, ...(decodeModelNumber(m.code) ?? {}) } : m)

/**
 * Curated display order for categories/products — the API returns both
 * alphabetically, which loses the deliberate compute → storage → chassis →
 * workstation → edge marketing order. Site chrome, not catalogue data.
 */
export const CATEGORY_ORDER = ['compute', 'storage', 'chassis', 'workstation', 'edge']

/* ------------------------------------------------------------------ */
/* Product images                                                      */
/* ------------------------------------------------------------------ */

/**
 * Declared gallery images for a product, in display order. Reads the API's
 * embedded `product.images`, synthesizing a stable `id` the gallery/lightbox
 * key on (the API doesn't send one). Safe on null.
 */
export const imagesFor = (product) =>
  (product?.images ?? []).map((img, i) => ({ id: `cat-${i}`, ...img }))

/* ------------------------------------------------------------------ */
/* Product cards                                                       */
/* ------------------------------------------------------------------ */

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
