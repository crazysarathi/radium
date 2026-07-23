/**
 * Chassis catalogue — mirrored from AIC (aicipc.com) on 2026-07-23.
 *
 * Three subfamilies, matching AIC's Chassis navigation:
 *   server-chassis — RSC rackmount server storage chassis
 *   industrial-pc  — RMC industrial rackmount PC chassis
 *   es1-chassis    — ES1 tool-free 2U server chassis series
 *
 * Model numbers, spec bullets and photography come from the AIC product list
 * pages (https://www.aicipc.com/products/chassis/<family>/). Images are served
 * locally from `public/products/<family>/<id>.jpg`. Add a model here and it
 * shows up in the family's model grid with no other edits.
 */

export const chassisModels = {
  'server-chassis': [
    { id: 'rsc-4h1', model: 'RSC-4H1', ru: '4U', img: '/products/server-chassis/rsc-4h1.jpg',
      bullets: ['4U 33.6" depth server storage chassis', 'Support EATX M/B', '60 x 3.5" + Max 8 x 2.5" SATA/SAS or NVMe hot-swap bays', '800W 2+2 or 1600W 1+1 redundant PSU in option'] },
    { id: 'rsc-4h', model: 'RSC-4H', ru: '4U', img: '/products/server-chassis/rsc-4h.jpg',
      bullets: ['4U 37.4" depth server storage', 'Support EATX M/B', '60 x 3.5" hot-swap bays', '1600W redundant PSU'] },
    { id: 'rsc-4et3', model: 'RSC-4ET3', ru: '4U', img: '/products/server-chassis/rsc-4et3.jpg',
      bullets: ['4U 26.8" depth server storage', 'Support EATX M/B', '24 x 3.5" hot-swap bays', 'Up to 6 PCIe Gen.4 NVMe U.2 plus 2.5" SAS x2', '1200W redundant PSU'] },
    { id: 'rsc-4ets', model: 'RSC-4ETS', ru: '4U', img: '/products/server-chassis/rsc-4ets.jpg',
      bullets: ['4U short 22" depth server storage', 'Support ATX M/B', '24 x 3.5" hot-swap bays', '800W redundant PSU'] },
    { id: 'rsc-4et', model: 'RSC-4ET', ru: '4U', img: '/products/server-chassis/rsc-4et.jpg',
      bullets: ['4U 26.8" depth server storage', 'Support EATX M/B', '24 x 3.5" hot-swap bays', '1200W redundant PSU'] },
    { id: 'rsc-4bt3', model: 'RSC-4BT3', ru: '4U', img: '/products/server-chassis/rsc-4bt3.jpg',
      bullets: ['4U 26.8" depth server storage', 'Support E-ATX M/B', '36 x 3.5" hot-swap bays', '1200W redundant PSU'] },
    { id: 'rsc-4bt', model: 'RSC-4BT', ru: '4U', img: '/products/server-chassis/rsc-4bt.jpg',
      bullets: ['4U 26.7" depth server storage', 'Support EATX M/B', '36 x 3.5" hot-swap bays', '1200W redundant PSU'] },
    { id: 'rsc-3ets', model: 'RSC-3ETS', ru: '3U', img: '/products/server-chassis/rsc-3ets.jpg',
      bullets: ['3U short 22" depth server storage', 'Support ATX M/B', '16 x 3.5" hot-swap bays', '800W redundant PSU'] },
    { id: 'rsc-3et', model: 'RSC-3ET', ru: '3U', img: '/products/server-chassis/rsc-3et.jpg',
      bullets: ['3U 26.8" depth server storage', 'Support EATX M/B', '16 x 3.5" hot-swap bays', '800W redundant PSU'] },
    { id: 'rsc-2ms', model: 'RSC-2MS', ru: '2U', img: '/products/server-chassis/rsc-2ms.jpg',
      bullets: ['2U 33" depth server storage', 'Support ATX M/B', '24 x 3.5" hot-swap bays', '800W redundant PSU'] },
    { id: 'rsc-2kt3', model: 'RSC-2KT3', ru: '2U', img: '/products/server-chassis/rsc-2kt3.jpg',
      bullets: ['2U 8-bay SAS/SATA or NVMe', 'Support EATX M/B', '8 x 3.5" hot-swap bays', '1200W 1+1 redundant PSU'] },
    { id: 'rsc-2kts', model: 'RSC-2KTS', ru: '2U', img: '/products/server-chassis/rsc-2kts.jpg',
      bullets: ['2U 22" depth server storage', 'Support up to ATX M/B', 'External 8 x 3.5" hot-swap bays', '550W single or redundant PSU'] },
    { id: 'rsc-2kt', model: 'RSC-2KT', ru: '2U', img: '/products/server-chassis/rsc-2kt.jpg',
      bullets: ['2U 26.8" depth server storage', 'Support EATX M/B', '8 x 3.5" hot-swap bays', '550W redundant PSU'] },
    { id: 'rsc-2ets', model: 'RSC-2ETS', ru: '2U', img: '/products/server-chassis/rsc-2ets.jpg',
      bullets: ['2U short 22" depth server storage', 'Support ATX M/B', '12 x 3.5" hot-swap bays', '550W redundant PSU'] },
    { id: 'rsc-2et', model: 'RSC-2ET', ru: '2U', img: '/products/server-chassis/rsc-2et.jpg',
      bullets: ['2U 26.8" depth server storage', 'Support EATX M/B', '12 x 3.5" hot-swap bays', '800W redundant PSU'] },
    { id: 'rsc-2et3', model: 'RSC-2ET3', ru: '2U', img: '/products/server-chassis/rsc-2et3.jpg',
      bullets: ['2U 26.8" depth server storage', 'Support EATX M/B', '12 x 3.5" tri-mode hot swap bays', '1200W redundant PSU'] },
    { id: 'rsc-2at', model: 'RSC-2AT', ru: '2U', img: '/products/server-chassis/rsc-2at.jpg',
      bullets: ['2U 26.8" depth server storage', 'Support EATX M/B', '24 x 2.5" hot-swap bays', '800W redundant PSU'] },
    { id: 'rsc-2at3', model: 'RSC-2AT3', ru: '2U', img: '/products/server-chassis/rsc-2at3.jpg',
      bullets: ['2U 26.8" depth server storage', 'Support EATX M/B', '24 x 2.5" tri-mode hot swap bays', '1200W redundant PSU'] },
    { id: 'rsc-1dt3', model: 'RSC-1DT3', ru: '1U', img: '/products/server-chassis/rsc-1dt3.jpg',
      bullets: ['Support EATX M/B', 'External 4 x 3.5" hot-swap bays', '750W 1+1 redundant power supply'] },
    { id: 'rsc-1dts', model: 'RSC-1DTS', ru: '1U', img: '/products/server-chassis/rsc-1dts.jpg',
      bullets: ['1U short 21.8" depth server storage', 'Support ATX M/B', 'External 4 x 3.5" hot-swap bays', '400W single or 300W redundant PSU'] },
    { id: 'rsc-1dt', model: 'RSC-1DT', ru: '1U', img: '/products/server-chassis/rsc-1dt.jpg',
      bullets: ['1U 26.8" depth server storage', 'Support EATX M/B', '4 x 3.5" hot-swap bays', '500W single or 450W redundant PSU'] },
    { id: 'rsc-1at3', model: 'RSC-1AT3', ru: '1U', img: '/products/server-chassis/rsc-1at3.jpg',
      bullets: ['Support EATX M/B', '10 x 2.5" hot-swap bays', '750W 1+1 redundant power supply'] },
    { id: 'rsc-1at', model: 'RSC-1AT', ru: '1U', img: '/products/server-chassis/rsc-1at.jpg',
      bullets: ['1U 26.8" depth server storage', 'Support EATX M/B', '10 x 2.5" hot-swap bays', '500W single or 650W redundant PSU'] },
  ],
  'industrial-pc': [
    { id: 'rmc-2e1', model: 'RMC-2E1(BTO)', ru: '2U', img: '/products/industrial-pc/rmc-2e1.jpg',
      bullets: ['2U chassis with 17.7" depth', 'External 4 x 2.5"', '800W redundant PSU'] },
    { id: 'rmc-4s1', model: 'RMC-4S1', ru: '4U', img: '/products/industrial-pc/rmc-4s1.jpg',
      bullets: ['4U chassis with 20" depth', 'Internal 2 x 3.5" + 2 x 2.5", external 2 x 2.5" hot-swap (optional)', 'Support CRPS (optional)'] },
    { id: 'rmc-4s', model: 'RMC-4S', ru: '4U', img: '/products/industrial-pc/rmc-4s.jpg',
      bullets: ['4U chassis with 20" depth', 'External 3 x 5.25" + 1 x 3.5", Internal 2 x 3.5"', 'PS2 type (optional)'] },
    { id: 'rmc-3n', model: 'RMC-3N', ru: '3U', img: '/products/industrial-pc/rmc-3n.jpg',
      bullets: ['3U chassis', 'External 6 x 5.25" + 1 x 3.5", Internal 1 x 3.5"', '550W single or redundant (optional)'] },
    { id: 'rmc-2a', model: 'RMC-2A', ru: '2U', img: '/products/industrial-pc/rmc-2a.jpg',
      bullets: ['2U chassis with 17" depth', 'External 1 x 5.25", 1 x 3.5" & 1 x Slim DVD-ROM external', '400W FLEX single PSU'] },
    { id: 'rmc-2e', model: 'RMC-2E', ru: '2U', img: '/products/industrial-pc/rmc-2e.jpg',
      bullets: ['2U chassis with 17.7" depth', 'External 4 x 2.5"', '800W redundant PSU'] },
    { id: 'rmc-1e', model: 'RMC-1E', ru: '1U', img: '/products/industrial-pc/rmc-1e.jpg',
      bullets: ['1U chassis with 15" depth', '2 x 3.5"', 'Single 250W'] },
  ],
  'es1-chassis': [
    { id: 'es1-212-e1', model: 'ES1-212-E1(BTO)', ru: '2U', img: '/products/es1-chassis/es1-212-e1.jpg',
      bullets: ['2U 28.3" depth server storage', 'EATX+ M/B support', '12 x 3.5"/2.5" hot-swap tray', '800W~2000W redundant PSU', '3 x 8038 PWM FAN'] },
    { id: 'es1-208-e1', model: 'ES1-208-E1(BTO)', ru: '2U', img: '/products/es1-chassis/es1-208-e1.jpg',
      bullets: ['2U 28.3" depth server storage', 'EATX+ M/B support', '8 x 3.5"/2.5" hot-swap tray', '550W~1200W redundant PSU', '3 x 8038 PWM FAN'] },
    { id: 'es1-212-e0', model: 'ES1-212-E0', ru: '2U', img: '/products/es1-chassis/es1-212-e0.jpg',
      bullets: ['2U 28.3" depth server storage', 'EATX+ M/B support', '12 x 3.5"/2.5" hot-swap tray', '2 x 2.5" hot-swap tray (rear)', '800W~2000W redundant PSU', '(3 + 1) x 8038 PWM hot swap FAN module', 'Front VGA port'] },
    { id: 'es1-208-e0', model: 'ES1-208-E0', ru: '2U', img: '/products/es1-chassis/es1-208-e0.jpg',
      bullets: ['2U 28.3" depth server storage', 'EATX+ M/B support', '8 x 3.5"/2.5" hot-swap tray', '2 x 2.5" hot-swap tray (rear)', '550W~1300W redundant PSU', '3 x 8038 PWM hot swap FAN'] },
  ],
}

/** Models for a chassis family slug ([] for non-chassis families). */
export const chassisModelsFor = (slug) => chassisModels[slug] ?? []

/** True when the slug is one of the chassis subfamilies. */
export const isChassisFamily = (slug) => Boolean(chassisModels[slug])

/** Distinct rack units present in a family, in ascending order — filter chips. */
export const chassisRackUnits = (slug) =>
  [...new Set(chassisModelsFor(slug).map((m) => m.ru))].sort()
