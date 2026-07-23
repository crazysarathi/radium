/**
 * Product catalogue photography — served locally from `public/products/`.
 *
 * The files were downloaded from the manufacturer's website (AIC, aicipc.com)
 * on 2026-07-23, so pages never depend on a third-party host. One entry per
 * family slug; order = gallery order, first image is the card/cover shot.
 * Families with no entry show a reserved empty panel until photography is
 * added — drop a file in `public/products/<slug>/` and list it here.
 *
 * Source pages the shots came from (for refreshing them later):
 *   mercury — AIC SB102-SU     https://www.aicipc.com/products-detail/sb102-su/
 *   jupiter — AIC HA401-TU     https://www.aicipc.com/products-detail/ha401-tu/
 *   io      — AIC J4024-05-04X https://www.aicipc.com/products-detail/j4024-05-04x/
 *   saturn  — AIC HA202-PV     https://www.aicipc.com/products-detail/ha202-pv/
 * neptune / mars / pluto have no AIC equivalent (AIC sells no towers, mini
 * desktops or fanless boxes) — their space stays reserved.
 *
 * The chassis families (server-chassis / industrial-pc / es1-chassis) reuse
 * per-model shots from `src/data/chassis.js` — the gallery shows a
 * representative spread, every model photo appears in the family model grid.
 */

export const productImages = {
  mercury: [
    { label: 'Front 45°', src: '/products/mercury/front-45.jpg' },
    { label: 'Front', src: '/products/mercury/front.jpg' },
    { label: 'Rear', src: '/products/mercury/rear.jpg' },
    { label: 'Top open', src: '/products/mercury/top.jpg' },
  ],
  jupiter: [
    { label: 'Front 45°', src: '/products/jupiter/front-45.jpg' },
    { label: 'Front', src: '/products/jupiter/front.jpg' },
    { label: 'Rear', src: '/products/jupiter/rear.jpg' },
    { label: 'Rear 45°', src: '/products/jupiter/rear-45.jpg' },
    { label: 'Top open', src: '/products/jupiter/top.jpg' },
  ],
  io: [
    { label: 'Front 45°', src: '/products/io/front-45.jpg' },
    { label: 'Front', src: '/products/io/front.jpg' },
    { label: 'Rear', src: '/products/io/rear.jpg' },
  ],
  saturn: [
    { label: 'Front 45°', src: '/products/saturn/front-45.jpg' },
    { label: 'Rear', src: '/products/saturn/rear.jpg' },
    { label: 'Top open', src: '/products/saturn/top.jpg' },
  ],
  'server-chassis': [
    { label: 'RSC-4BT — 4U 36-bay', src: '/products/server-chassis/rsc-4bt.jpg' },
    { label: 'RSC-4H — 4U 60-bay', src: '/products/server-chassis/rsc-4h.jpg' },
    { label: 'RSC-2ET — 2U 12-bay', src: '/products/server-chassis/rsc-2et.jpg' },
    { label: 'RSC-1AT — 1U 10-bay', src: '/products/server-chassis/rsc-1at.jpg' },
  ],
  'industrial-pc': [
    { label: 'RMC-4S — 4U', src: '/products/industrial-pc/rmc-4s.jpg' },
    { label: 'RMC-3N — 3U', src: '/products/industrial-pc/rmc-3n.jpg' },
    { label: 'RMC-2E — 2U', src: '/products/industrial-pc/rmc-2e.jpg' },
    { label: 'RMC-1E — 1U', src: '/products/industrial-pc/rmc-1e.jpg' },
  ],
  'es1-chassis': [
    { label: 'ES1-212-E0 — 12-bay', src: '/products/es1-chassis/es1-212-e0.jpg' },
    { label: 'ES1-208-E0 — 8-bay', src: '/products/es1-chassis/es1-208-e0.jpg' },
    { label: 'ES1-212-E1 — 12-bay BTO', src: '/products/es1-chassis/es1-212-e1.jpg' },
    { label: 'ES1-208-E1 — 8-bay BTO', src: '/products/es1-chassis/es1-208-e1.jpg' },
  ],
}

/** Declared gallery images for a product, in display order. Safe on null. */
export const imagesFor = (product) =>
  (productImages[product?.slug] ?? []).map((img, i) => ({
    id: `cat-${i}`,
    remote: true, // still guarded by the gallery's dead-source fallback
    ...img,
  }))
