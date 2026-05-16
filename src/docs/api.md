---
title: API Reference
metaTitle: 5SVG REST API Reference — SVG Icons & Categories
description: Free REST API to list, search, and fetch SVG icons and brand logo vectors from the 5SVG catalog. JSON endpoints, TypeScript types, and rate limits.
---

## Introduction

The 5SVG REST API gives you free access to our SVG library: list every vector icon, search SVG files by title, filter by category, and fetch raw SVG markup for apps, plugins, and design tools. Responses include download URLs, categories, and optional light/dark SVG variants.

## Limitations

The API is currently open to everyone and does not require any authentication. However, to prevent abusive use of the API, there is a limit to the number of requests.

> Don't use the API for create the same product as 5SVG. The API is intended to be used for extensions, plugins, or other tools that can help the community.

## Base URLs

SVGs URL:

```bash
https://5svg.com/api
```

Categories URL:

```bash
https://5svg.com/api/categories
```

## Typescript

You can use the following types for the SVG responses:

```ts
export type ThemeOptions = {
  dark: string;
  light: string;
};

export interface SVG {
  id: number;
  title: string;
  category: string | string[];
  route: string | ThemeOptions;
  url: string;
  wordmark?: string | ThemeOptions;
  brandUrl?: string;
}
```

> If you need types for the `category`, you can find them [here](https://github.com/phototourl/5svg/blob/main/src/types/categories.ts). Change the type of `category` to `Category | Category[]`.

## Endpoints

### Get all SVGs

```bash
https://5svg.com/api
```

```json
// Returns:
[
  {
    "id": 0,
    "title": "Discord",
    "category": "Software",
    "route": "https://5svg.com/discord.svg",
    "url": "https://discord.com/"
  },
  ...
]
```

### Get all SVGs with limit

```bash
https://5svg.com/api?limit=10
```

```json
// Returns:
[
  {
    "id": 0,
    "title": "Discord",
    "category": "Software",
    "route": "https://5svg.com/discord.svg",
    "url": "https://discord.com/"
  },
  ...
]
```

### Get SVGs by category

```bash
https://5svg.com/api/category/software
```

```json
// Returns:
[
  {
    "id": 0,
    "title": "Discord",
    "category": "Software",
    "route": "https://5svg.com/discord.svg",
    "url": "https://discord.com/"
  },
  ...
]
```

> The list of categories is available [here](https://github.com/phototourl/5svg/blob/main/src/types/categories.ts).

### Get the SVG code

Optimized SVG using [svgo](https://github.com/svg/svgo):

```bash
https://5svg.com/api/svg/adobe.svg
```

No optimized SVG:

```bash
https://5svg.com/api/svg/adobe.svg?no-optimize
```

```html
<!-- Returns: -->
<svg
  width="91"
  height="80"
  viewBox="0 0 91 80"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g clip-path="url(#clip0_906_1839)">
    <path d="M56.9686 0H90.4318V80L56.9686 0Z" fill="#EB1000" />
    <path d="M33.4632 0H0V80L33.4632 0Z" fill="#EB1000" />
    <path
      d="M45.1821 29.4668L66.5199 80.0002H52.5657L46.1982 63.9461H30.6182L45.1821 29.4668Z"
      fill="#EB1000"
    />
  </g>
  <defs>
    <clipPath id="clip0_906_1839">
      <rect width="90.4318" height="80" fill="white" />
    </clipPath>
  </defs>
</svg>
```

### Search SVG by title

```bash
https://5svg.com/api?search=axiom
```

```json
// Returns:
[
  {
    "id": 267,
    "title": "Axiom",
    "category": "Software",
    "route": {
      "light": "https://5svg.com/axiom-light.svg",
      "dark": "https://5svg.com/axiom-dark.svg"
    },
    "url": "https://axiom.co/"
  }
]
```

### Get the list of categories

```bash
https://5svg.com/api/categories
```

```json
// Returns:
[
  {
    "category": "Software",
    "total": 97
  },
  {
    "category": "Library",
    "total": 25
  }
  //...
]
```
