# Product photos

Photography for every product surface on the site — product cards, product /
model detail pages, the certified pre-owned listing and the solutions page.

Most files were downloaded from AIC's catalogue (aicipc.com); `neptune`,
`mars` and `pluto` have no AIC equivalent, so their shots come from Supermicro
(SYS-751A-I tower), ASRock Industrial (NUCS BOX-155H mini PC) and Advantech
(UNO-2271G V2 edge gateway) respectively. Source pages are listed in
`src/data/productImages.js`, which also controls gallery order and labels.
A family with no photos shows a reserved "Product photography to follow"
panel on detail pages and a faint no-photo mark on cards until files are
added here.

## Where files go

```
public/products/<product-slug>/<view>.<ext>
```

- **Slugs:** `mercury` · `jupiter` · `io` · `saturn` · `neptune` · `mars` · `pluto`
- **Views:** `front-45` (primary — used on cards) · `front` · `rear` · `top`
- **Extensions tried, in order:** `.jpg` → `.png` → `.webp`

### Example

```
public/products/jupiter/front-45.jpg   ← main image + card thumbnail
public/products/jupiter/front.jpg
public/products/jupiter/rear.jpg
public/products/jupiter/top.jpg
```

Files matching the view names above are discovered automatically. To control
the order/label, or to add extra angles (e.g. `rear-45`), list them in
`src/data/productImages.js` — declared entries come first and are deduped
against auto-discovered files.

## Per-SKU photos (Jupiter models — optional)

```
public/products/jupiter/<model-code>/front-45.jpg     e.g. .../242016/front-45.jpg
```

A model with its own folder uses those shots; otherwise it falls back to the
family photos.

## Shooting guidance (to match AIC / Supermicro catalogue shots)

- **Angle:** front-left 3/4 (≈45°) hero for `front-45`; straight-on for `front`.
- **Background:** white or transparent, like the AIC studio shots already here.
- **Aspect:** card slots are ~360:236 — export around **1600 × 1050** so nothing
  is upscaled. Detail images can be any aspect (they letterbox to fit).
- **Consistency:** keep the same crop, distance and lighting across a family so
  the cards line up.
