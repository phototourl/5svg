# Stamp template gallery — development specification

> **Purpose**: This document is a complete development spec for building an SEO-optimized stamp template gallery. An AI or developer should be able to read this document end-to-end and implement the entire feature without additional context.

---

## 1. Project overview

### 1.1 What we're building

A multi-page stamp template gallery for the "Stamp Maker" product. The gallery serves as both a browsable template library for users and an SEO traffic engine targeting hundreds of long-tail keywords.

### 1.2 Core SEO strategy

The gallery uses a **programmatic SEO** approach: each filter combination (use case × country) generates a unique, server-rendered landing page with its own URL, meta tags, structured data, and unique editorial content. This is NOT a single-page app with JavaScript filters — every meaningful filter combination is a real, crawlable, indexable page.

### 1.3 Target keywords and traffic potential

Primary keyword clusters this gallery targets:

| Cluster | Example keywords | Monthly volume | Competition index | Priority |
|---------|-----------------|---------------|-------------------|----------|
| Blank templates | blank stamp template, stamp template | 500–5,000 | 0–3 | P0 — lowest competition, build first |
| Digital stamp tools | digital stamp maker, digital stamp creator | 500 | 28 | P0 |
| Seal / chop / hanko | hanko stamp generator online, seal stamp creator | 500 | 25–96 | P1 |
| Company / business | company stamp generator, business stamp maker | 50–500 | 57 avg | P1 |
| Logo stamps | logo stamp maker, stamp logo design | 500 | 66 avg | P1 |
| Notary stamps | notary stamp maker, notary stamp images | 50–500 | 71 avg | P2 |
| Signature stamps | signature stamp maker | 500 | 100 | P2 |
| Leather stamps | leather stamp maker, custom leather stamp maker | 500 | 97–100 | P2 — high competition, long-term |
| Country-specific | Japanese company stamp, US notary stamp | 50–500 | varies | P1 |

Trending keywords (YoY growth 900%+): stamp template, leather stamp maker, company stamp generator, silhouette mint stamp maker.

---

## 2. Information architecture

### 2.1 URL structure

```
Base path: /stamp-templates

Hierarchy:
/stamp-templates/                                    → Hub page (all templates)
/stamp-templates/{use-case}/                         → Use-case landing page
/stamp-templates/country/{country-slug}/             → Country landing page
/stamp-templates/{use-case}/country/{country-slug}/  → Cross-filter combo page
/stamp-templates/template/{template-slug}/           → Individual template detail page
```

**URL rules:**
- All slugs are lowercase, hyphen-separated, no trailing slash inconsistency (pick one pattern and 301 the other)
- Country slugs use full lowercase English name: `japan`, `china`, `united-states`, `united-kingdom`, `india`, `germany`, `south-korea`, `france`, `australia`, `canada`, `thailand`, `malaysia`, `singapore`, `uae`, `saudi-arabia`
- Use-case slugs: `company`, `notary`, `signature`, `seal`, `leather`, `logo`, `blank`, `address`, `rubber`, `digital`, `wax`, `wedding`
- If a user navigates to a combo that does not exist (zero templates), return a 404 page with suggestions — do NOT serve a 200 with empty content

### 2.2 Page types

There are 4 distinct page types. Each is rendered on the server (SSR/SSG).

| Page type | URL pattern | Purpose |
|-----------|-------------|---------|
| Hub | `/stamp-templates/` | Aggregates all categories, targets "stamp template" head term |
| Use-case listing | `/stamp-templates/{use-case}/` | Lists templates for one use case |
| Country listing | `/stamp-templates/country/{country}/` | Lists templates for one country |
| Combo listing | `/stamp-templates/{use-case}/country/{country}/` | Cross-filtered view, targets long-tail |
| Template detail | `/stamp-templates/template/{slug}/` | Individual template page |

### 2.3 Which combo pages to generate

Do NOT generate all possible `use-case × country` combinations. Only generate pages that meet BOTH criteria:
1. At least 3 templates exist for that combination
2. The combination has validated search demand (see section 10 for the seed list)

Estimated initial page count:
- 1 hub page
- ~12 use-case pages
- ~15 country pages
- ~40–60 combo pages (validated combinations only)
- N template detail pages (depends on template count)

---

## 3. Data model

### 3.1 Template

```typescript
interface StampTemplate {
  id: string;                    // unique ID, e.g. "tpl_abc123"
  slug: string;                  // URL slug, e.g. "japanese-corporate-round-seal"
  name: string;                  // display name, e.g. "Japanese corporate round seal"
  description: string;           // 1-2 sentence description
  thumbnailUrl: string;          // preview image URL
  previewUrl: string;            // larger preview or interactive preview URL
  useCase: UseCase;              // primary use case enum
  useCaseSecondary?: UseCase[];  // secondary use cases (a template can appear in multiple)
  country: CountryCode;          // primary country
  countriesSecondary?: CountryCode[]; // additional countries it applies to
  stampShape: 'circle' | 'rectangle' | 'square' | 'oval' | 'custom';
  tags: string[];                // free-form tags for search, e.g. ["hanko", "inkan", "kaisha-in"]
  isEditable: boolean;           // whether user can customize online
  isFree: boolean;               // free vs premium
  createdAt: string;             // ISO date
  popularity: number;            // download/usage count for sorting
}
```

### 3.2 Use case

```typescript
type UseCase =
  | 'company'
  | 'notary'
  | 'signature'
  | 'seal'
  | 'leather'
  | 'logo'
  | 'blank'
  | 'address'
  | 'rubber'
  | 'digital'
  | 'wax'
  | 'wedding';
```

### 3.3 Country

```typescript
type CountryCode =
  | 'united-states'
  | 'united-kingdom'
  | 'japan'
  | 'china'
  | 'india'
  | 'south-korea'
  | 'germany'
  | 'france'
  | 'australia'
  | 'canada'
  | 'thailand'
  | 'malaysia'
  | 'singapore'
  | 'uae'
  | 'saudi-arabia';
```

### 3.4 Category page content

Each listing page (use-case, country, combo) needs unique editorial content stored in a CMS or config:

```typescript
interface CategoryPageContent {
  // Routing
  useCase?: UseCase;
  country?: CountryCode;

  // SEO meta
  metaTitle: string;         // max 60 chars, includes primary keyword
  metaDescription: string;   // max 155 chars
  canonicalPath: string;     // self-referencing canonical

  // Page content
  h1: string;                // unique H1, includes target keyword
  heroDescription: string;   // 2-3 sentences, placed under H1
  aboutTitle: string;        // e.g. "About Japanese company stamps"
  aboutBody: string;         // 200-500 words, unique per page (see section 6)
  faqs: FAQ[];               // 3-5 FAQs per page (see section 6)
  relatedCategories: string[]; // paths to related listing pages for internal linking

  // Target keywords (for reference, not rendered)
  primaryKeyword: string;
  secondaryKeywords: string[];
}

interface FAQ {
  question: string;
  answer: string;             // 2-4 sentences
}
```

---

## 4. Page layout specification

### 4.1 Hub page (`/stamp-templates/`)

```
┌─────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Stamp templates                  │
│                                                     │
│ H1: Free stamp templates                            │
│ Description: Browse 500+ customizable stamp          │
│ templates for every occasion...                     │
├─────────────────────────────────────────────────────┤
│ Category cards grid (use cases)                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│ │ Company  │ │  Seal    │ │  Logo    │ │ Notary │  │
│ │ 120 tmpl │ │  85 tmpl │ │  67 tmpl │ │ 45 tmpl│  │
│ └──────────┘ └──────────┘ └──────────┘ └────────┘  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│ │Signature │ │ Leather  │ │  Blank   │ │Digital │  │
│ └──────────┘ └──────────┘ └──────────┘ └────────┘  │
├─────────────────────────────────────────────────────┤
│ Country section header: "Browse by country"         │
│ Country tag cloud / grid (links to country pages)   │
│ 🇺🇸 US  🇯🇵 Japan  🇨🇳 China  🇬🇧 UK  🇮🇳 India ... │
├─────────────────────────────────────────────────────┤
│ "Most popular templates" — top 12 by popularity     │
│ Template card grid (3-4 columns)                    │
├─────────────────────────────────────────────────────┤
│ About section (300-500 words, unique content)       │
├─────────────────────────────────────────────────────┤
│ FAQ section (5 items, FAQPage schema)               │
└─────────────────────────────────────────────────────┘
```

### 4.2 Listing page (use-case / country / combo)

```
┌─────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Stamp templates > Company > Japan│
├─────────────────────────────────────────────────────┤
│ H1: Japanese company stamp templates                │
│ Hero description (2-3 sentences with keywords)      │
├─────────────────────────────────────────────────────┤
│ Filter bar                                          │
│ ┌─────────────────────────────┐ ┌────────────────┐  │
│ │ Use case: [Company ▾]       │ │ Country: [Japan]│  │
│ └─────────────────────────────┘ └────────────────┘  │
│                                                     │
│ Active filters (pill badges, each is an <a> link):  │
│ [✕ Company] [✕ Japan]  ← clicking removes filter    │
├─────────────────────────────────────────────────────┤
│ Results count + sort: "48 templates · Sort: Popular"│
├─────────────────────────────────────────────────────┤
│ Template card grid                                  │
│ ┌──────┐ ┌──────┐ ┌──────┐                         │
│ │ img  │ │ img  │ │ img  │                         │
│ │ name │ │ name │ │ name │  ← 3 columns desktop    │
│ │ tags │ │ tags │ │ tags │    2 columns tablet     │
│ └──────┘ └──────┘ └──────┘    1 column mobile      │
│                                                     │
│ ┌──────┐ ┌──────┐ ┌──────┐                         │
│ │      │ │      │ │      │                         │
│ │      │ │      │ │      │                         │
│ └──────┘ └──────┘ └──────┘                         │
│                                                     │
│ ... (24 per page)                                   │
├─────────────────────────────────────────────────────┤
│ Pagination: ← 1 2 3 4 5 →                          │
│ (links to /stamp-templates/company/country/japan/   │
│  page/2/)                                           │
├─────────────────────────────────────────────────────┤
│ About section (unique 200-500 word editorial)       │
│ e.g. "About Japanese company stamps — In Japan,     │
│ company stamps (kaisha-in) serve as..."             │
├─────────────────────────────────────────────────────┤
│ Related categories (internal links)                 │
│ [Japanese personal hanko] [Chinese company seal]    │
│ [Korean corporate stamp] [US notary stamp]          │
├─────────────────────────────────────────────────────┤
│ FAQ section (3-5 unique questions + FAQPage schema) │
└─────────────────────────────────────────────────────┘
```

### 4.3 Template detail page

```
┌─────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Stamp templates > Company >      │
│             Japan > Japanese corporate round seal    │
├─────────────────────────────────────────────────────┤
│ ┌──────────────────┐  H1: Japanese corporate        │
│ │                  │  round seal template            │
│ │   Large preview  │                                │
│ │     image        │  Description paragraph         │
│ │                  │                                │
│ │                  │  Tags: [Company] [Japan]       │
│ └──────────────────┘  [Round] [Hanko]               │
│                                                     │
│ [✦ Use this template] ← CTA button, links to editor│
├─────────────────────────────────────────────────────┤
│ Template details (shape, size, editable areas)      │
├─────────────────────────────────────────────────────┤
│ "Similar templates" grid (6 items, internal links)  │
├─────────────────────────────────────────────────────┤
│ "Also popular in Japan" (6 items, cross-sell)       │
└─────────────────────────────────────────────────────┘
```

### 4.4 Template card component

Every template card in the grid must follow this structure:

```html
<article class="template-card">
  <a href="/stamp-templates/template/{slug}/" aria-label="{template name}">
    <img
      src="{thumbnailUrl}"
      alt="{descriptive alt text, e.g. 'Round red Japanese corporate seal stamp template with kanji text'}"
      width="300"
      height="300"
      loading="lazy"
    />
  </a>
  <div class="template-card__info">
    <h3>
      <a href="/stamp-templates/template/{slug}/">{template name}</a>
    </h3>
    <div class="template-card__meta">
      <span class="tag">{useCase label}</span>
      <span class="tag">{country label}</span>
    </div>
  </div>
</article>
```

**Critical**: The template name MUST be real text in the HTML, not baked into the image. Search engines need crawlable text.

---

## 5. Filter system — technical requirements

### 5.1 Core principle

**Every filter change = a real navigation to a new URL.** Filters are `<a>` links, NOT JavaScript event handlers. This ensures:
- Every filter state is a unique, crawlable URL
- Users can bookmark/share filtered views
- Browser back/forward works naturally
- Google discovers all pages through link crawling

### 5.2 Filter bar implementation

```html
<!-- Filter dropdowns — each option is a link -->
<nav class="filter-bar" aria-label="Template filters">

  <!-- Use case filter -->
  <div class="filter-group">
    <label>Use case</label>
    <select onchange="window.location.href = this.value">
      <option value="/stamp-templates/">All</option>
      <option value="/stamp-templates/company/" selected>Company</option>
      <option value="/stamp-templates/notary/">Notary</option>
      <option value="/stamp-templates/seal/">Seal</option>
      <!-- ... -->
    </select>
  </div>

  <!-- Country filter -->
  <div class="filter-group">
    <label>Country</label>
    <select onchange="window.location.href = this.value">
      <option value="/stamp-templates/company/">All countries</option>
      <option value="/stamp-templates/company/country/japan/" selected>Japan</option>
      <option value="/stamp-templates/company/country/china/">China</option>
      <!-- ... -->
    </select>
  </div>

</nav>

<!-- Active filters — each is a link to remove that filter -->
<div class="active-filters">
  <a href="/stamp-templates/country/japan/" class="filter-pill active">
    ✕ Company
  </a>
  <a href="/stamp-templates/company/" class="filter-pill active">
    ✕ Japan
  </a>
</div>
```

**Fallback for non-JS**: The `<select>` approach requires JS for the `onchange`. As a progressive enhancement fallback, also render the full list of filter links in a `<noscript>` block or as the default mobile view.

### 5.3 Sort options

Sort is the ONE filter dimension allowed as a query parameter (not a new page):

```
/stamp-templates/company/country/japan/?sort=popular    (default)
/stamp-templates/company/country/japan/?sort=newest
/stamp-templates/company/country/japan/?sort=name
```

Add `<link rel="canonical" href="/stamp-templates/company/country/japan/" />` on all sort variants to avoid duplicate content.

### 5.4 Pagination

```
/stamp-templates/company/country/japan/           → page 1 (canonical)
/stamp-templates/company/country/japan/page/2/    → page 2
/stamp-templates/company/country/japan/page/3/    → page 3
```

- 24 templates per page (configurable, 24–36 recommended)
- Include `<link rel="prev">` and `<link rel="next">` in `<head>`
- Page 1 canonical should NOT include `/page/1/` — redirect `/page/1/` to the base URL
- Pagination links must be `<a>` tags (crawlable)

---

## 6. SEO content requirements

### 6.1 Meta tags per page type

**Hub page:**
```html
<title>Free stamp templates — Browse 500+ designs | Stamp Maker</title>
<meta name="description" content="Browse and customize 500+ free stamp templates for companies, notary, seals, logos, and more. Available for 15+ countries. Create your stamp online instantly." />
```

**Use-case page (example: company):**
```html
<title>Company stamp templates — free business stamp designs | Stamp Maker</title>
<meta name="description" content="Browse 120+ company stamp templates. Create professional business stamps, corporate seals, and official company stamps online. Free to customize." />
```

**Country page (example: Japan):**
```html
<title>Japanese stamp templates — hanko, inkan & company seals | Stamp Maker</title>
<meta name="description" content="Browse Japanese stamp templates including hanko, inkan, corporate seals (kaisha-in), and personal stamps. Customizable for Japanese business requirements." />
```

**Combo page (example: company + Japan):**
```html
<title>Japanese company stamp templates — corporate hanko & seals | Stamp Maker</title>
<meta name="description" content="Create Japanese company stamps online. Browse 48 templates for corporate seals (kaisha-in), representative stamps (daihyo-in), and bank stamps (ginko-in)." />
```

**Rules:**
- `<title>` max 60 characters, primary keyword near the front
- `<meta description>` max 155 characters, include CTA verb ("browse", "create", "customize")
- Every page MUST have a unique title and description — no duplicates
- Include brand name "Stamp Maker" at end of title, separated by ` | `

### 6.2 H1 rules

Every listing page gets exactly one `<h1>`. Format patterns:

| Page type | H1 pattern | Example |
|-----------|-----------|---------|
| Hub | Free stamp templates | Free stamp templates |
| Use case only | {Use case} stamp templates | Company stamp templates |
| Country only | {Country} stamp templates | Japanese stamp templates |
| Combo | {Country} {use case} stamp templates | Japanese company stamp templates |

- Use natural language, not "Templates — Company — Japan"
- Include the primary target keyword naturally
- If the country has a culturally specific term, include it: "Japanese stamp templates — hanko & inkan designs"

### 6.3 About section content

Each listing page MUST include a unique 200–500 word "about" section below the template grid. This is what separates these pages from thin content.

**Content structure per page:**
1. What this type of stamp is and when it's used (1–2 paragraphs)
2. Key variations / subtypes (1 paragraph)
3. Country-specific legal or cultural requirements if applicable (1 paragraph)
4. How to use the templates on this page (1 paragraph)

**Example for "Japanese company stamp templates" page:**

> In Japan, company stamps (kaisha-in) are essential tools for business authorization. Unlike Western countries where signatures are the primary form of authentication, Japanese business culture relies heavily on registered seals to validate contracts, bank transactions, and official documents.
>
> Three main types of company stamps are required for business operations in Japan. The representative seal (daihyo-in) is the most important — it's registered with the Legal Affairs Bureau and used for contracts and major decisions. The bank stamp (ginko-in) is registered with financial institutions for banking transactions. The corporate seal (kaku-in) is used for everyday business documents like invoices and receipts.
>
> Size requirements are standardized: the daihyo-in must be between 10mm and 30mm in diameter (18mm is most common), while the kaku-in is typically rectangular, around 21mm × 60mm. Most company stamps use tensho (seal script) or kaisho (regular script) fonts.
>
> Our Japanese company stamp templates follow these standards. Browse the collection above and click any template to customize it with your company name, registration number, and preferred layout.

**Absolutely NEVER duplicate content between pages.** Each about section must be written uniquely even for similar topics. Thin or duplicated content will cause Google to deindex pages.

### 6.4 FAQ content

Each listing page includes 3–5 FAQs. These MUST be marked up with FAQPage schema (see section 7).

**FAQ writing rules:**
- Questions must be phrased as actual search queries people type
- Answers are 2–4 sentences, factual, useful
- Include the target keyword naturally in at least 2 questions
- Never duplicate FAQs across pages

**Example FAQs for "Japanese company stamp templates":**

Q: What size should a Japanese company stamp be?
A: The representative seal (daihyo-in) must be between 10mm and 30mm in diameter, with 18mm being the most common. The corporate stamp (kaku-in) is typically rectangular at 21mm × 60mm.

Q: Are digital company stamps legally valid in Japan?
A: Since Japan's 2021 Digital Reform Act, electronic seals are accepted for most business documents. However, contracts requiring Legal Affairs Bureau registration still need a physical stamp.

Q: What font is used for Japanese company stamps?
A: Tensho (seal script) is the traditional and most commonly used font for company stamps. Kaisho (regular script) is also acceptable for less formal stamps.

### 6.5 Internal linking requirements

Each listing page must include a "Related categories" section with 4–8 links to other listing pages. Link selection rules:

1. If viewing a combo page (use-case + country), link to:
   - The same use case in neighboring countries
   - Other use cases in the same country
   - The parent use-case page (without country filter)
   - The parent country page (without use-case filter)

2. If viewing a single-dimension page (use case only or country only), link to:
   - Related use cases (e.g. "company" links to "seal", "logo", "notary")
   - Top country variants of the same use case
   - The hub page

These links use descriptive anchor text that includes the target page's primary keyword. Example:

```html
<nav aria-label="Related categories">
  <h2>Related stamp categories</h2>
  <ul>
    <li><a href="/stamp-templates/seal/country/japan/">Japanese seal stamps</a></li>
    <li><a href="/stamp-templates/company/country/china/">Chinese company stamps</a></li>
    <li><a href="/stamp-templates/company/country/south-korea/">Korean corporate stamps</a></li>
    <li><a href="/stamp-templates/notary/country/united-states/">US notary stamps</a></li>
  </ul>
</nav>
```

---

## 7. Structured data (schema markup)

### 7.1 Breadcrumb (all pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.stampmaker.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Stamp templates",
      "item": "https://www.stampmaker.com/stamp-templates/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Company",
      "item": "https://www.stampmaker.com/stamp-templates/company/"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Japan",
      "item": "https://www.stampmaker.com/stamp-templates/company/country/japan/"
    }
  ]
}
```

### 7.2 FAQPage (listing pages)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What size should a Japanese company stamp be?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The representative seal (daihyo-in) must be between 10mm and 30mm in diameter, with 18mm being the most common."
      }
    }
  ]
}
```

### 7.3 CollectionPage (listing pages)

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Japanese company stamp templates",
  "description": "Browse 48 Japanese company stamp templates...",
  "url": "https://www.stampmaker.com/stamp-templates/company/country/japan/",
  "numberOfItems": 48,
  "hasPart": [
    {
      "@type": "CreativeWork",
      "name": "Japanese corporate round seal",
      "url": "https://www.stampmaker.com/stamp-templates/template/japanese-corporate-round-seal/",
      "thumbnailUrl": "https://..."
    }
  ]
}
```

### 7.4 SoftwareApplication (template detail page)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Stamp Maker — Japanese corporate round seal",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### 7.5 Implementation

All structured data is injected as `<script type="application/ld+json">` in the `<head>` section. Multiple schemas can coexist on the same page (e.g., BreadcrumbList + FAQPage + CollectionPage).

---

## 8. Technical SEO requirements

### 8.1 Rendering

All listing pages MUST be server-side rendered (SSR) or statically generated (SSG). The template grid, about section, FAQs, internal links, and all text content must be present in the initial HTML response. Client-side JavaScript may enhance the experience (lazy-load images, animate transitions) but must NOT be required for content visibility.

**Recommended approach:**
- Use Next.js `getStaticPaths` + `getStaticProps` for SSG
- Generate all validated combo pages at build time
- Rebuild on template content changes (ISR with revalidation)

### 8.2 Canonical URLs

Every page must include a self-referencing canonical:

```html
<link rel="canonical" href="https://www.stampmaker.com/stamp-templates/company/country/japan/" />
```

**Canonical rules:**
- Sort variants (`?sort=newest`) canonical to the base URL (without sort param)
- `/page/1/` redirects 301 to base URL
- Only one URL path per combo: `/company/country/japan/` is canonical, redirect `/country/japan/company/` via 301
- HTTPS only, www vs non-www consistent (pick one, 301 the other)

### 8.3 Hreflang (if multi-language)

If the site supports multiple languages, each listing page needs hreflang tags:

```html
<link rel="alternate" hreflang="en" href="https://www.stampmaker.com/stamp-templates/company/country/japan/" />
<link rel="alternate" hreflang="ja" href="https://www.stampmaker.com/ja/stamp-templates/company/country/japan/" />
<link rel="alternate" hreflang="x-default" href="https://www.stampmaker.com/stamp-templates/company/country/japan/" />
```

### 8.4 XML sitemap

Generate a dedicated sitemap for the gallery:

```
/sitemap-stamp-templates.xml
```

Include ALL generated listing pages and template detail pages. Priority values:
- Hub page: `1.0`
- Use-case pages: `0.8`
- Country pages: `0.8`
- Combo pages: `0.7`
- Template detail pages: `0.6`
- Paginated pages (page/2, page/3...): `0.3`

Changefreq: `weekly` for listing pages, `monthly` for template detail pages.

Register this sitemap in `robots.txt`:

```
Sitemap: https://www.stampmaker.com/sitemap-stamp-templates.xml
```

### 8.5 robots.txt rules

```
User-agent: *
Allow: /stamp-templates/
Disallow: /stamp-templates/*?sort=
```

Block sort parameter URLs from crawling (they're canonical'd to the base anyway).

### 8.6 Image optimization

- All template thumbnails must have descriptive `alt` text (not "template_001.png" but "Round red Japanese corporate seal stamp with kanji company name")
- Use next-gen formats: WebP with JPEG fallback
- Thumbnail size: 300×300px for grid, 600×600px for detail page
- Always specify `width` and `height` attributes to prevent CLS
- Use `loading="lazy"` on below-the-fold images
- Use `fetchpriority="high"` on the first 3 visible thumbnails

### 8.7 Performance targets

- LCP < 2.5s on 4G mobile
- CLS < 0.1
- FID < 100ms
- All listing pages < 200KB initial HTML (before images)

---

## 9. Component specifications

### 9.1 Breadcrumb component

```
Props:
  items: Array<{ label: string, href: string }>

Renders:
  <nav aria-label="Breadcrumb">
    <ol itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a itemprop="item" href="/"><span itemprop="name">Home</span></a>
        <meta itemprop="position" content="1" />
      </li>
      <!-- ... -->
    </ol>
  </nav>

Notes:
  - Use ">" as visual separator via CSS ::after pseudo-element
  - Last item is plain text (no link), represents current page
  - Include both JSON-LD and microdata for maximum compatibility
```

### 9.2 Filter bar component

```
Props:
  currentUseCase: UseCase | null
  currentCountry: CountryCode | null
  useCases: Array<{ slug: string, label: string, count: number }>
  countries: Array<{ slug: string, label: string, count: number }>

Behavior:
  - Renders two <select> dropdowns
  - Each option's value is the full URL path for that filter state
  - Changing a dropdown navigates to the new URL (real navigation, not SPA)
  - Active filters are shown as removable pill badges below dropdowns
  - Removing a pill navigates to the URL without that filter dimension
  - Mobile: dropdowns stack vertically
  - Desktop: dropdowns side by side

URL construction logic:
  selectUseCase(uc):
    if currentCountry: → /stamp-templates/{uc}/country/{currentCountry}/
    else:              → /stamp-templates/{uc}/

  selectCountry(country):
    if currentUseCase: → /stamp-templates/{currentUseCase}/country/{country}/
    else:              → /stamp-templates/country/{country}/

  removeUseCase():
    if currentCountry: → /stamp-templates/country/{currentCountry}/
    else:              → /stamp-templates/

  removeCountry():
    if currentUseCase: → /stamp-templates/{currentUseCase}/
    else:              → /stamp-templates/
```

### 9.3 Template grid component

```
Props:
  templates: StampTemplate[]
  columns: 3 (desktop) | 2 (tablet) | 1 (mobile)

Renders:
  CSS Grid layout with responsive columns.
  Each cell is a TemplateCard component.
  Grid uses gap: 16px (desktop), 12px (mobile).
```

### 9.4 Pagination component

```
Props:
  currentPage: number
  totalPages: number
  basePath: string  // e.g. "/stamp-templates/company/country/japan"

Renders:
  <nav aria-label="Pagination">
    <a href="{basePath}/" aria-label="Previous page">←</a>
    <a href="{basePath}/">1</a>
    <a href="{basePath}/page/2/" aria-current="page">2</a>
    <a href="{basePath}/page/3/">3</a>
    <span>...</span>
    <a href="{basePath}/page/8/">8</a>
    <a href="{basePath}/page/3/" aria-label="Next page">→</a>
  </nav>

Rules:
  - Show max 5 page numbers at a time with ellipsis
  - First and last page always visible
  - All links are <a> tags with real href (crawlable)
  - Current page has aria-current="page" and no href
  - Page 1 links to base path (no /page/1/)
```

### 9.5 About section component

```
Props:
  title: string
  body: string (HTML allowed for links and formatting)

Renders:
  <section class="about-section">
    <h2>{title}</h2>
    <div class="about-body">{body}</div>
    <button class="read-more" aria-expanded="false">Read more</button>
  </section>

Behavior:
  - Initially show first 150 characters with "Read more" button
  - Expanding shows full content
  - The FULL content must be in the initial HTML (not fetched via JS)
  - CSS hides the overflow; "Read more" toggles visibility via JS
  - Use <noscript> style to show all content if JS is disabled
```

### 9.6 FAQ section component

```
Props:
  faqs: Array<{ question: string, answer: string }>

Renders:
  <section>
    <h2>Frequently asked questions</h2>
    <dl class="faq-list">
      <div class="faq-item">
        <dt><button aria-expanded="false">{question}</button></dt>
        <dd>{answer}</dd>
      </div>
      <!-- ... -->
    </dl>
  </section>

Behavior:
  - Accordion pattern: click question to toggle answer visibility
  - Full answer text is in the HTML (hidden via CSS, not JS-loaded)
  - First FAQ is open by default
  - Includes FAQPage JSON-LD schema in page head
```

---

## 10. Seed data: validated combo pages

Below is the initial set of combo pages to generate. Each has been validated against keyword search data. The `aboutBody` and `faqs` content must be written uniquely for every page — use section 6.3 guidelines.

### 10.1 Use-case pages (no country filter)

| Slug | H1 | Primary keyword | Secondary keywords |
|------|----|-----------------|--------------------|
| company | Company stamp templates | company stamp generator | business stamp maker, corporate stamp template, official company stamp |
| seal | Seal & chop stamp templates | seal stamp creator | chop maker, stamp seal maker, hanko stamp generator |
| logo | Logo stamp templates | logo stamp maker | stamp logo design, create logo stamp |
| notary | Notary stamp templates | notary stamp maker | notary stamp images, notary seal template |
| signature | Signature stamp templates | signature stamp maker | signature stamp maker online |
| leather | Leather stamp templates | leather stamp maker | custom leather stamp maker, makers mark stamp for leather |
| blank | Blank stamp templates | blank stamp template | blank postage stamp template |
| digital | Digital stamp templates | digital stamp maker | digital stamp creator, digital seal maker |
| rubber | Rubber stamp templates | rubber stamp maker | custom rubber stamp maker, rubber stamp maker online |
| wax | Wax seal stamp templates | wax seal maker | custom wax stamp maker, wax stamp maker |
| address | Address stamp templates | address stamp maker | create your own address stamp |
| wedding | Wedding stamp templates | wedding stamp template | wedding stamp design |

### 10.2 Country pages (no use-case filter)

| Slug | H1 | Primary keyword | Notes |
|------|----|-----------------|-------|
| japan | Japanese stamp templates | Japanese stamp template | Cover hanko, inkan, kaisha-in terminology |
| china | Chinese stamp templates | Chinese stamp template | Cover company chop, official seal culture |
| united-states | US stamp templates | US stamp template | Cover notary requirements, address stamps |
| united-kingdom | UK stamp templates | British stamp maker | Cover Companies House requirements |
| india | Indian stamp templates | Indian stamp template | Cover company seal, court fee stamps |
| south-korea | Korean stamp templates | Korean stamp template | Cover dojang culture |
| germany | German stamp templates | German stamp template | Cover Stempel culture |
| france | French stamp templates | French stamp template | Cover cachet/tampon |
| uae | UAE stamp templates | UAE stamp template | Cover Arabic company seals |
| saudi-arabia | Saudi stamp templates | Saudi stamp template | Cover Arabic circular seals |
| singapore | Singapore stamp templates | Singapore stamp template | Cover company common seal |
| australia | Australian stamp templates | Australian stamp template | Cover notary, business stamps |
| canada | Canadian stamp templates | Canadian stamp template | Cover notary, corporate seals |
| thailand | Thai stamp templates | Thai stamp template | Cover company seal requirements |
| malaysia | Malaysian stamp templates | Malaysian stamp template | Cover company common seal |

### 10.3 Priority combo pages

These are cross-filter pages with validated or inferred search demand:

| Use case | Country | H1 | Priority |
|----------|---------|----|----------|
| company | japan | Japanese company stamp templates | P0 |
| company | china | Chinese company stamp templates | P0 |
| seal | japan | Japanese seal stamp templates | P0 |
| seal | china | Chinese seal stamp templates | P0 |
| notary | united-states | US notary stamp templates | P0 |
| company | united-states | US company stamp templates | P1 |
| company | south-korea | Korean company stamp templates | P1 |
| company | uae | UAE company stamp templates | P1 |
| company | saudi-arabia | Saudi company stamp templates | P1 |
| company | india | Indian company stamp templates | P1 |
| company | united-kingdom | UK company stamp templates | P1 |
| company | singapore | Singapore company stamp templates | P1 |
| seal | south-korea | Korean seal stamp templates | P1 |
| logo | japan | Japanese logo stamp templates | P2 |
| logo | china | Chinese logo stamp templates | P2 |
| notary | canada | Canadian notary stamp templates | P2 |
| notary | australia | Australian notary stamp templates | P2 |
| leather | united-states | US leather stamp templates | P2 |
| signature | japan | Japanese signature stamp templates | P2 |
| company | germany | German company stamp templates | P2 |
| company | france | French company stamp templates | P2 |
| company | thailand | Thai company stamp templates | P2 |
| company | malaysia | Malaysian company stamp templates | P2 |
| wax | united-kingdom | UK wax seal stamp templates | P2 |
| digital | japan | Japanese digital stamp templates | P2 |

---

## 11. Implementation checklist

### Phase 1 — Infrastructure (Week 1–2)
- [ ] Set up Next.js project with SSG/ISR
- [ ] Define data models (TypeScript interfaces from section 3)
- [ ] Create template content database/CMS structure
- [ ] Build URL routing for all page types (section 2)
- [ ] Implement 301 redirects for duplicate URL patterns
- [ ] Set up image optimization pipeline (WebP, responsive sizes)

### Phase 2 — Core components (Week 2–3)
- [ ] Build Breadcrumb component with microdata
- [ ] Build FilterBar component with real-URL navigation
- [ ] Build TemplateCard component with proper alt text
- [ ] Build TemplateGrid component (responsive 3/2/1 columns)
- [ ] Build Pagination component with crawlable links
- [ ] Build AboutSection component (expandable, full HTML in source)
- [ ] Build FAQSection component (accordion, full HTML in source)
- [ ] Build RelatedCategories component

### Phase 3 — Page assembly (Week 3–4)
- [ ] Build Hub page layout
- [ ] Build Listing page layout (shared by use-case, country, combo)
- [ ] Build Template detail page layout
- [ ] Implement page generation logic (which combo pages to build)
- [ ] Wire up structured data (JSON-LD) generation for all schema types

### Phase 4 — Content & SEO (Week 4–5)
- [ ] Write unique meta title + description for all listing pages
- [ ] Write unique H1 for all listing pages
- [ ] Write unique about section (200–500 words) for all listing pages
- [ ] Write unique FAQs (3–5) for all listing pages
- [ ] Define related categories links for all listing pages
- [ ] Add hreflang tags if multi-language
- [ ] Generate XML sitemap
- [ ] Configure robots.txt
- [ ] Test all canonical URLs
- [ ] Test all 301 redirects

### Phase 5 — QA & launch (Week 5–6)
- [ ] Run Lighthouse audit on all page types (target 90+ performance)
- [ ] Validate structured data with Google Rich Results Test
- [ ] Test all filter navigation paths (every combination works)
- [ ] Test pagination on all listing pages
- [ ] Verify no duplicate content (check meta titles, about sections)
- [ ] Verify all images have descriptive alt text
- [ ] Test mobile responsiveness on all page types
- [ ] Submit sitemap to Google Search Console
- [ ] Monitor indexing over first 2 weeks

---

## 12. Content generation guidelines for AI

If using AI to generate the unique about-section and FAQ content for each page, follow these rules:

### 12.1 About section generation prompt template

```
Write a 200-500 word informational section about {use_case} stamps in {country}.

Requirements:
- Explain what this type of stamp is and its primary uses
- Include country-specific cultural or legal context
- Mention specific subtypes, sizes, or format standards
- Include naturally embedded keywords: {primary_keyword}, {secondary_keywords}
- End with a 1-sentence call to action referencing the templates
- Tone: informative, professional, not salesy
- Do NOT duplicate content from other pages (provided: {list_of_existing_about_sections})
```

### 12.2 FAQ generation prompt template

```
Write 4 FAQs about {use_case} stamps in {country}.

Requirements:
- Questions should be real queries people search for
- Include the keyword "{primary_keyword}" in at least 2 questions
- Answers are 2-4 sentences, factual, directly useful
- Cover: size/format requirements, legal validity, customization options, common use cases
- Do NOT duplicate questions from these existing FAQ sets: {list_of_existing_faqs}
```

### 12.3 Alt text generation prompt template

```
Write a descriptive alt text for a stamp template image.

Template details:
- Name: {template_name}
- Shape: {shape}
- Use case: {use_case}
- Country: {country}
- Colors: {dominant_colors}
- Text visible: {text_on_stamp}

Rules:
- Max 125 characters
- Describe what is visually shown
- Include the stamp type and key visual features
- Do NOT start with "Image of" or "Picture of"
```

---

## 13. Monitoring & iteration

### 13.1 Key metrics to track

- Organic impressions and clicks per page type (via Google Search Console)
- Indexed page count (target: 100% of generated pages indexed within 4 weeks)
- Average position for target keywords per page
- CTR from search results (optimize meta descriptions for pages with high impressions but low CTR)
- Bounce rate per page type (if > 70%, review content quality)
- Template usage rate from gallery pages (conversion metric)

### 13.2 Ongoing content expansion

- Monthly: Check Google Search Console for new queries landing on gallery pages → create new combo pages if demand appears
- Monthly: Review "related searches" in GSC for content gap opportunities
- Quarterly: Refresh about-section content on top 20 pages by traffic
- Quarterly: Add new country pages based on traffic patterns and new template availability

### 13.3 A/B test opportunities

- Template grid columns: 3 vs 4 per row
- CTA button text: "Use this template" vs "Customize now" vs "Start editing"
- About section position: below grid vs above grid
- FAQ open/closed default state
