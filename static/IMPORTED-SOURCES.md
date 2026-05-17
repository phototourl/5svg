# External icon packs (`static/`)

Served on `/more/[pack]`. **Not** merged into `library/`.

| Folder | Route | Index |
|--------|-------|-------|
| `bootstrap-icons/` | `/more/bootstrap-icons` | `index.json` |
| `font-awesome-7/` | `/more/font-awesome` | `index.json` |
| `react-icons/` | `/more/react-icons` | `index.json` |

Regenerate indexes after adding SVGs:

```bash
pnpm build:pack-indexes
```

These folders must be **committed to git** (≈45MB total) so Docker/Dokploy images include them. After adding SVGs locally, run:

```bash
pnpm build:pack-indexes
git add static/bootstrap-icons static/font-awesome-7 static/react-icons
```

If a pack is missing on the server, `/more/{pack}` returns 503 instead of a broken index fetch.

Licenses: Bootstrap Icons (MIT), Font Awesome icons (CC BY 4.0), react-icons (per upstream pack).
