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

Licenses: Bootstrap Icons (MIT), Font Awesome icons (CC BY 4.0), react-icons (per upstream pack).
