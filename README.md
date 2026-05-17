# 5svg

**[5SVG.com](https://5svg.com)** is your go-to platform for high-quality SVG icons, vector illustrations, and graphic assets. Search, preview, edit, and download free or premium resources to streamline your design and development projects.

- **Website:** [5svg.com](https://5svg.com)
- **Repository:** [github.com/phototourl/5svg](https://github.com/phototourl/5svg)

> This project is based on [svgl](https://github.com/pheralb/svgl) (MIT). See [NOTICE](./NOTICE) and [LICENSE](./LICENSE).

## Features

- Browse and search SVG icons and vectors by category
- Light / dark theme previews where assets support it
- Copy SVG source, download assets, and optional shadcn/ui registry
- Documentation and API routes included in the monorepo

## Tech stack

- [SvelteKit](https://kit.svelte.dev/) + [Svelte 5](https://svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Content Collections](https://www.content-collections.dev/) for docs
- [Hono](https://hono.dev/) + Cloudflare Workers (`api-routes/`, optional)

## Getting started

**Requirements:** Node.js 20+, [pnpm](https://pnpm.io/)

```bash
git clone https://github.com/phototourl/5svg.git
cd 5svg
pnpm install
pnpm dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Production build

```bash
pnpm build:prod
pnpm preview
```

**Dokploy:** Commit the three folders under `static/` (`bootstrap-icons`, `font-awesome-7`, `react-icons`, ~45MB). The Font Awesome pack is browsed at `/more/font-awesome`. Run `pnpm build:pack-indexes` before pushing so each pack has `index.json`. Without them in the repo, `/more/*` will 503 on production while the main library still works.

## Adding icons

1. Place optimized `.svg` files in [`static/library/`](./static/library/) (keep `viewBox`; aim for &lt; 21kb per file).
2. Register each asset in [`src/data/svgs.ts`](./src/data/svgs.ts):

```ts
{
  title: "My Icon",
  category: "Design",
  route: "/library/my-icon.svg",
  url: "https://example.com",
}
```

Categories are defined in [`src/types/categories.ts`](./src/types/categories.ts).

> Only upload assets you have the right to distribute. See the in-app warning banner for takedown requests.

## API (optional)

Public API docs (when deployed): [5svg.com/docs/api](https://5svg.com/docs/api)

Local development:

```bash
cd api-routes
pnpm install
# Create .dev.vars with UPSTASH_REDIS_URL / UPSTASH_REDIS_TOKEN if using rate limits
pnpm dev
```

## Analytics (Google)

Same as phototourl: **do not hardcode the ID in source**. Set it at **build time**.

**Dokploy → Build-time Arguments** (same variable name as phototourl):

```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-V4P03XBERL
```

Local dev: copy [`.env.example`](./.env.example) to `.env`.

Toggle only in [`src/config/website.ts`](./src/config/website.ts): `analytics.enableGoogleAnalytics`.

## Scripts

| Command | Description |
| -------- | ------------- |
| `pnpm dev` | Start the web app |
| `pnpm build` | Build the web app |
| `pnpm build:prod` | Build registry + production bundle |
| `pnpm check` | Typecheck (svelte-check) |
| `pnpm lint` | ESLint |
| `pnpm check:data` | Validate `svgs.ts` data |

## Contributing

Issues and pull requests are welcome on [phototourl/5svg](https://github.com/phototourl/5svg).

## License

- Application code: [MIT](./LICENSE) (includes third-party notice in [NOTICE](./NOTICE)).
- Individual SVG files may have their own brand or trademark restrictions.
