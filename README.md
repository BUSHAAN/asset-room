# Asset Room

A personal library for websites you do not want to lose — UI kits, animation libraries, design systems, icons, and other developer tooling.

Anyone can browse and search the collection. Only a signed-in admin can add, edit, or delete entries.

## What it does

Each resource is a card: title, URL, short description, tags, and a preview image pulled from the site’s Open Graph (or Twitter) meta tags.

Typical entries look like:

- UI component libraries
- Animation and motion libraries
- Icon sets, color tools, and design resources
- Other developer tooling sites

The homepage is a dark, editorial grid. Click a card to open the site in a new tab. Click a tag to search by that tag.

## Features

- **Browse** resources in a responsive 1 / 2 / 3 column card grid
- **Search** by title, description, or tags (debounced, synced to `?q=` in the URL)
- **Filter by tag** — clicking a tag on a card fills the search field
- **Infinite scroll** — 9 resources per page, loaded as you scroll
- **Link previews** — OG/Twitter images are fetched when a resource is saved, and fetched on demand if missing
- **Admin CRUD** — add, edit, and delete resources after signing in
- **Safe delete** — two-step confirmation; you must type the resource title to delete it
- **Public read, private write** — listing and search need no login; mutating the library does

## Stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, Cormorant Garamond + Source Sans 3 |
| Database | MongoDB via [Mongoose](https://mongoosejs.com) (`assetroom`) |
| Auth | Firebase Authentication (email/password) + Firebase Admin SDK |
| Validation | Zod |
| Icons | lucide-react |

Firebase is used only for authentication. Resource data lives in MongoDB, not Firestore.

## How it works

```
Browser
  ├─ GET  /api/resources          public list + search
  ├─ GET  /api/resources/:id      public single resource
  ├─ GET  /api/preview?url=…      public OG image lookup (cached 24h)
  └─ POST / PUT / DELETE          require Firebase ID token
        │
        ├─ Firebase Admin verifies Bearer token
        └─ Mongoose writes to MongoDB
```

1. The homepage loads pages of 9 resources, sorted A–Z by title.
2. Search is a case-insensitive substring match across title, description, and tags (not MongoDB `$text`, so prefixes like `colo` still match `color`).
3. Creating or updating a resource fetches the URL’s HTML, extracts `og:image` / `twitter:image`, and stores it on the document.
4. If a card has no stored preview, the client calls `/api/preview` and the result is cached for 24 hours.
5. Preview fetching refuses private/local hosts (SSRF guard), only follows `http`/`https`, times out at 8s, and reads at most 1 MB of HTML.

## Pages

| Route | Who | Purpose |
| --- | --- | --- |
| `/` | Anyone | Library grid, search, infinite scroll |
| `/admin` | Anyone | Admin sign-in (redirects home if already logged in) |
| `/login` | Anyone | Redirects to `/admin` |
| `/add` | Admin | Create a resource |
| `/edit/[id]` | Admin | Update a resource, or delete it |

When signed in, the header menu exposes **Add Resource** and **Logout**. Edit pencils appear on each card.

## Data model

A resource document:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | Required, min 2 characters |
| `url` | string | Required, valid URL |
| `description` | string | Required, min 5 characters |
| `tags` | string[] | Optional; entered as comma-separated text in the form |
| `previewImage` | string? | OG/Twitter image URL, filled in on save |
| `createdAt` / `updatedAt` | dates | Mongoose timestamps |

## API

### `GET /api/resources`

Query params: `q` (search), `page` (default 1), `limit` (default 9, max 50).

Returns `{ data, pagination: { total, page, limit, totalPages } }`.

### `POST /api/resources`

Auth required. Body: `{ title, url, description, tags? }`. Creates the document and stores a preview image when one can be found.

### `GET /api/resources/:id`

Public. Returns one resource, or 404.

### `PUT /api/resources/:id`

Auth required. Same body as create. Re-fetches the preview only if the URL changed.

### `DELETE /api/resources/:id`

Auth required. Permanently deletes the document.

### `GET /api/preview?url=`

Public. Returns `{ image }` (URL or `null`). Cached for 24 hours.

Authenticated requests send `Authorization: Bearer <Firebase ID token>`.

## Local setup

**Requirements:** Node.js 20+, a MongoDB database, and a Firebase project with Email/Password sign-in enabled. Create one admin user in the Firebase console — there is no public sign-up in the app.

1. Clone and install:

```bash
npm install
```

2. Create `.env.local` in the project root:

```bash
# Firebase client (browser)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Firebase Admin (server — service account)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# MongoDB
MONGODB_URI=
```

`FIREBASE_PRIVATE_KEY` should be the service account private key. If it is stored as a single line, keep the `\n` escape sequences; the app expands them at runtime.

The app connects to the `assetroom` database on that URI.

3. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in at `/admin` to add resources.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Project layout

```
app/
  page.tsx                 Homepage grid + search
  add/page.tsx             Create (protected)
  edit/[id]/page.tsx       Edit / delete (protected)
  admin/page.tsx           Sign-in
  login/page.tsx           Redirect → /admin
  api/resources/           List + create
  api/resources/[id]/      Get / update / delete
  api/preview/             On-demand OG image
  components/              Cards, form, header, auth gate
  contexts/AuthContext.tsx Firebase session
lib/
  mongoose.ts              DB connection
  auth.ts                  requireAuth()
  firebase-admin.ts        Admin SDK
  preview.ts               OG scrape + SSRF checks
models/Resource.ts
validators/resource.ts     Zod schema
hooks/                     Infinite scroll, debounce, authenticated fetch
```

## Design

Dark navy canvas (`#181715`) with cream text, coral primary (`#cc785c`), and a serif display / humanist sans pairing. The look is a dark take on a warm editorial palette — closer to a magazine shelf than a typical SaaS dashboard.
