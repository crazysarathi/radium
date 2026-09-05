# Radium Admin — Content Console

The admin console for the Radium website, served from the same project at
`/admin` (`admin/index.html` → `src/admin/main.jsx`). It is a separate page
with its own HashRouter, stylesheet and Tailwind config
(`tailwind.admin.config.js`) — **nothing in the public site (`src/`) is
imported by the admin at runtime, and vice versa.** It shares the client's
design system (ink canvas, beam accent, glass panels, Inter, same Tailwind
tokens) so both read as one product.

## Run it

```bash
npm install
npm run dev        # site: http://localhost:5173/   admin: http://localhost:5173/admin/
```

The admin talks to the backend through `VITE_API_URL` (see `.env.example`).
In production it is reachable at `https://radium-computers.vercel.app/admin`
(login page first; the console lives under `/admin/#/…`).

**Demo sign-in** (mock auth, stored in localStorage):

```
admin@radium.example
radium@2026
```

## What it manages

The console is intentionally product-only for now (other modules can return
later):

| Group     | Modules |
| :-------- | :------ |
| Catalogue | Products (families), per-product **Variants** (Jupiter SS with live model-number decoding + validation; every other family gets a model / RU / photo / bullets form), Accessories (each tagged with the products it is used with) |
| Inbox     | Enquiries (mock contact-form submissions) |
| Activity  | History — every create / update / delete made in the console |

Variants and accessories are segregated by product — open either from a
product's row in the Products list and you only ever see (and add) that
family's entries.

Every list has search, filters, pagination, status toggles, empty/loading
states; every mutation has validation, confirmation (for deletes) and toasts.

## Data: mock now, API later

- Seed JSON in `src/data/*.json` was **generated from the client's live data
  files** (`../src/data/*`), so the admin starts with exactly what the site
  renders today.
- On first read, a collection is copied into `localStorage`
  (`radium.admin.*`). All edits persist there. Clearing the `radium.admin.*`
  keys (or calling `resetAllData()` from `src/services`) restores the seeds.

### Swap plan (the only files that change)

```
src/services/api.js      createCollection / createDocument — replace the
                         localStorage bodies with fetch() calls:
                           list()        GET    /api/<key>
                           get(id)       GET    /api/<key>/:id
                           create(data)  POST   /api/<key>
                           update(id,p)  PATCH  /api/<key>/:id
                           remove(id)    DELETE /api/<key>/:id
src/services/auth.js     login() → POST /api/auth/login
src/components/ui/image-input.jsx  upload branch → POST /api/media
```

Screens call services through `useCollection` / `useDocument` hooks and never
touch storage directly, so no UI component changes when the backend lands.

## Architecture

```
src/
├── components/ui/   design-system kit (button, badge, fields, modal, table,
│                    pagination, toolbar, list editors, image input…)
├── layouts/         AdminLayout — sidebar + topbar shell
├── pages/           Login, History, NotFound
├── modules/         products (list + form + per-product variants and
│                    accessories), accessories, enquiries
├── services/        api.js (mock data layer), auth.js, storage.js, index.js
├── hooks/           useCollection, useDocument, useListControls
├── context/         AuthContext (protected routes), ToastContext
├── data/            seed JSON generated from the client site
├── styles/          Tailwind + the client's design tokens
└── utils/           cn, slugify, decodeModelNumber, formatters
```

Note: `public/products` is a symlink to the client's product photography so
image paths resolve identically in both apps.
