# External icon packs (`static/`)

Served on `/more/[pack]`. **Not** merged into `library/`.

| Folder | Route | Index |
|--------|-------|-------|
| `bootstrap-icons/` | `/more/bootstrap-icons` | `index.json` |
| `font-awesome-7/` | `/more/font-awesome-7` | `index.json` |
| `react-icons/` | `/more/react-icons` | `index.json` |

Regenerate indexes after adding SVGs:

```bash
pnpm build:pack-indexes
```

These folders are **gitignored** (too large for GitHub). For **Dokploy / Docker**:

1. Copy `static/bootstrap-icons/`, `static/font-awesome-7/`, and `static/react-icons/` onto the build machine **before** `pnpm build:prod`, **or**
2. Mount them as volumes on the running app at `build/client/{pack}/` after deploy.

If packs are missing at build time, `build:pack-indexes` skips them with a warning and the rest of the site still builds.

Licenses: Bootstrap Icons (MIT), Font Awesome icons (CC BY 4.0), react-icons (per upstream pack).
