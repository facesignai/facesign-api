# FaceSign API Documentation Site – Implementation Plan & Quick‑Start

## 1. Project Overview

**Goal** — Build a professional, full‑width, developer‑friendly documentation portal for the FaceSign API inside `facesign-api/docs`, using Next 14 (App Router) + Nextra 4.2 + Tailwind CSS + shadcn/ui.

**Audience** — A junior developer with zero context should be able to clone the repo, follow the Quick‑Start section below, and deploy to Vercel or Firebase Hosting.

---

## 2. Project Goals

| Goal | Detail |
|------|--------|
| Professional appearance | Stripe / Mintlify‑grade look & feel |
| Full‑width layout | No 90 rem clamp; content stretches with safe gutters |
| Developer‑friendly | MDX pages, React components, shadcn/ui primitives |
| Production‑ready | Static export or serverless; deployable to Vercel & Firebase |

---

## 3. 🚀 Quick‑Start (local dev in ≤ 5 min)

Runs on http://localhost:4000 using Yarn.

```bash
# 0. prerequisites: Node 18+, Yarn (classic or Berry), Git clone
cd facesign-api/docs        # 1 · enter workspace
yarn install                # 2 · install deps (uses yarn.lock)
cp .env.example .env.local  # 3 · add API key & other secrets

# 4 · start dev server on fixed port 4000
yarn dev                    # → http://localhost:4000
```

### What the command does
- **yarn dev** – script is locked via cross‑env → `PORT=4000 next dev -p 4000`.
- Tailwind & shadcn/ui are already configured; modify `styles/globals.css` to tweak the full‑width override:

```css
.nextra-content {
  @apply max-w-none w-screen px-8 lg:px-16;
}
```

### Production preview & deploy
>> Make sure you are in the correct directory `/Users/davidgonen/Github/facesign-all/facesign-api/docs` before running these commands.

```bash
next build && next export   # build static site
yarn start                  # serves static export on :4000

# deploy
vercel --prod       # or
firebase deploy     # after firebase init hosting
```

---

## 4. Implementation Phases

### Phase 1 — Core Setup
1. **Scaffold**
```bash
cd facesign-api
yarn create next-app docs \
  --typescript --eslint --tailwind --src-dir --app
cd docs
yarn add nextra@4.2.17 nextra-theme-docs@4.2.17
yarn add -D tailwindcss postcss autoprefixer cross-env \
  class-variance-authority tailwind-merge tailwindcss-animate \
  @types/mdx
```

2. **Initialize shadcn/ui**
```bash
yarn dlx shadcn@latest init
```

3. **Configure** – create `next.config.js`, `tailwind.config.js`, `theme.config.tsx`.
4. **Directory layout** – use App Router (`app/`, not `pages/`).
5. **Full‑width override** – add the `.nextra-content` rule to `styles/globals.css`.
6. **MDX type support** – create `mdx.d.ts` in the root:
```typescript
// mdx.d.ts
declare module '*.mdx' {
  const content: any
  export default content
}
```

### Phase 2 — Content Structure
- Create folders `app/api`, `app/guides`, `app/reference`, etc.
- Add `_meta.json` files for sidebar order.
- Place reusable components in `components/`.

### Phase 3 — Content Population
- Author pages with CONTENT_TEMPLATES.md.
- Build custom React pieces (e.g. EndpointCard).
- Include diagrams, screenshots, and OpenAPI embeds.

### Phase 4 — Finalisation & Deployment
- Verify FlexSearch or Algolia DocSearch.
- SEO & performance (Lighthouse ≥ 95).
- Deploy via Vercel or Firebase.

---

## 5. Technical Specifications

### 5.1 Dependencies (excerpt)

```json
{
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "nextra": "4.2.17",
    "nextra-theme-docs": "4.2.17",
    "clsx": "2.1.1",
    "lucide-react": "0.462.0",
    "tailwind-merge": "2.5.5",
    "next-themes": "0.2.1"
  },
  "devDependencies": {
    "typescript": "5.4.4",
    "tailwindcss": "3.4.4",
    "postcss": "8.4.49",
    "autoprefixer": "10.4.20",
    "cross-env": "7.0.3",
    "@types/mdx": "2.0.13"
  },
  "scripts": {
    "dev":   "cross-env PORT=4000 next dev -p 4000",
    "start": "cross-env PORT=4000 next start -p 4000",
    "build": "next build && next export",
    "lint":  "next lint",
    "typecheck": "tsc --noEmit --pretty"
  }
}
```

### 5.2 Key config snippets

```javascript
// next.config.js
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx'
});
module.exports = withNextra({
  reactStrictMode: true,
  images: { domains: ['facesign.ai'] },
  output: 'export'
});
```

```typescript
// theme.config.tsx
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span className="font-semibold">FaceSign API</span>,
  project: { link: 'https://github.com/facesignai/facesign-api' },
  docsRepositoryBase: 'https://github.com/facesignai/facesign-api/blob/main/docs',
  footer: { text: `© ${new Date().getFullYear()} FaceSign` },
  primaryHue: 225,
  darkMode: true
};
export default config;
```