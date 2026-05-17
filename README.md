# ZipLink

A fast, dark-themed URL shortener built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Create short links, track clicks, generate QR codes, and manage everything from a polished single-page dashboard.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Features

- **Instant shortening** — Create short links in one click
- **Click analytics** — 14-day click history chart per link
- **QR codes** — Auto-generated, downloadable QR codes
- **Custom slugs** — Brand links with memorable short names
- **Password protection** — Gate links behind a password
- **Expiry dates** — Auto-expire links on a chosen date
- **Tags** — Organize links with custom tags
- **UTM builder** — Append UTM parameters for campaign tracking
- **Pause / resume** — Disable links without deleting them
- **CSV export** — Export your link list as a spreadsheet
- **Search & filter** — Find links by URL, title, slug, or tag

## Demo

Run locally and open [http://localhost:3000](http://localhost:3000):

```bash
npm install
npm run dev
```

> Add a screenshot to your repo (e.g. `docs/preview.png`) and link it here after publishing to GitHub.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | [Lucide React](https://lucide.dev/) |
| QR codes | [`qrcode`](https://www.npmjs.com/package/qrcode) |
| Storage | Browser `localStorage` (no database required) |
| Fonts | Bebas Neue, DM Sans, DM Mono |

## Important: How Storage Works

Links are stored in the **browser’s `localStorage`**. There is no backend or database.

| Benefit | Trade-off |
|---------|-----------|
| Zero setup — works offline after first load | Links exist only in the browser where they were created |
| No API keys or hosting costs for data | Clearing site data removes all links |
| Great for demos and personal use | Short URLs shared with others **will not resolve** on other devices until you add a shared backend |

For a production deployment where anyone can open `yoursite.com/abc123`, you will need persistent server-side storage (e.g. Supabase, PlanetScale, Upstash Redis, or a simple API + database).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/ziplink.git
cd ziplink
npm install
```

### Environment variables

Copy the example env file and set your public base URL (used for short links and QR codes):

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Local development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Production (use your real domain)
# NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

## Deploy

### Vercel (recommended)

1. Push this repository to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Add environment variable: `NEXT_PUBLIC_BASE_URL` = your Vercel URL (or custom domain).
4. Deploy.

### Other platforms

Any host that supports Next.js (Railway, Netlify, Docker, etc.) works. Set `NEXT_PUBLIC_BASE_URL` to the public URL users will visit.

## Publish to GitHub

From the project folder:

```bash
git init
git add .
git commit -m "Initial commit: ZipLink URL shortener"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ziplink.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. Create an empty repository named `ziplink` on GitHub first (no README — this repo already includes one).

`.gitignore` already excludes `node_modules`, `.next`, and `.env.local`.

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Design tokens and global styles
│   ├── layout.tsx           # Root layout and metadata
│   ├── page.tsx             # Dashboard (create & manage links)
│   └── [slug]/
│       └── page.tsx         # Redirect, password gate, expiry states
├── components/
│   ├── Header.tsx
│   ├── ShortenForm.tsx      # URL form + advanced options
│   ├── LinkCard.tsx
│   ├── SuccessBanner.tsx
│   ├── StatsBar.tsx
│   ├── StatsChart.tsx
│   ├── FeaturesSection.tsx
│   ├── TickerTape.tsx
│   ├── QRModal.tsx
│   └── Toast.tsx
└── lib/
    ├── store.ts             # localStorage CRUD and analytics
    └── utils.ts             # Helpers
```

## Design

- **Primary**: `#c8f135` (acid green)
- **Accent**: `#ff4d1c` (ember red)
- **Background**: dark ink palette (`#0e0e0c` → `#f0f0ef`)

## License

MIT — free for personal and commercial use. See [LICENSE](LICENSE) if present, or add a standard MIT `LICENSE` file when publishing.

## Author

Built by [@YOUR_USERNAME](https://github.com/YOUR_USERNAME). Replace with your GitHub profile when you publish.
