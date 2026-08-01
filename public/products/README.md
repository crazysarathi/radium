# Product photos

Photography for every product surface on the site — product cards, product /
model detail pages, the certified pre-owned listing and the solutions page.

Most files were downloaded from AIC's catalogue (aicipc.com); `neptune`,
`mars` and `pluto` have no AIC equivalent, so their shots come from Supermicro
(SYS-751A-I tower), ASRock Industrial (NUCS BOX-155H mini PC) and Advantech
(UNO-2271G V2 edge gateway) respectively.

Gallery order and labels are no longer declared in this repo — the client
fetches each product's `images: [{label, src}]` list from the catalogue API
and renders it as-is (see `src/lib/catalogue.js`'s `imagesFor`). To add,
reorder or relabel a family's images, edit the product in the admin console;
point `src` at a file under this folder (root-relative, e.g.
`/products/jupiter/front-45.jpg`) to keep serving it from here, or upload
through the admin console to host it on the backend instead. A family with
no images shows a reserved "Product photography to follow" panel on detail
pages and a faint no-photo mark on cards.

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

There's no filesystem auto-discovery — every image a product shows must be
listed on its `images` field in the catalogue (admin console), pointing at a
file placed here. To add extra angles (e.g. `rear-45`), drop the file in the
product's folder and add a matching `{label, src}` entry in the admin.

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
