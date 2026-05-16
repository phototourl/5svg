/** SEO copy for `/directory/[category]` pages. */

export function getDirectorySeo(category: string, count: number) {
  return {
    title: `${category} SVG Icons — Free Vector Logos | 5SVG`,
    description: `Browse and download free ${category} SVG icons and brand logos. ${count}+ vector files — search, copy SVG code, or download with no signup.`,
    headerH1: `${category} SVG Icons`,
    subtitle: `Free ${category} vector SVG logos — search this category, copy markup, or download files.`,
    sections: [
      {
        h2: `Browse ${category} SVG icons`,
        h3: `Free ${category} vector logos in this category`,
      },
      {
        h2: `Download ${category} SVG files`,
        h3: `Copy or download ${category} icons`,
      },
    ],
  } as const;
}
