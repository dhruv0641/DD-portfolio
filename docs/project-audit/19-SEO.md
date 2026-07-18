# Project Audit: 19 - SEO Audit

This report details sitemaps configurations, search indexing parameters, and dynamic metadata schemas.

## 1. Dynamic Metadata Generation

The application implements dynamic SEO parameters in [src/app/layout.tsx:L30-L57](file:///d:/portfolio/src/app/layout.tsx#L30-L57) using Next.js's dynamic metadata compiler:

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const seoSettings = await db.select().from(schema.settings);
  
  const title = seoSettings.find(s => s.key === 'name')?.value || 'Dhruv Dobariya';
  const titleSuffix = seoSettings.find(s => s.key === 'title')?.value || 'Applied AI Engineer';
  const description = seoSettings.find(s => s.key === 'metaDescription')?.value || 'Applied AI Systems Portfolio';

  return {
    title: `${title} — ${titleSuffix}`,
    description,
    metadataBase: new URL('https://vance.engineering'),
    openGraph: {
      title: `${title} — ${titleSuffix}`,
      description,
      type: 'website',
      images: ['/uploads/hero_visual.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${titleSuffix}`,
      description,
      images: ['/uploads/hero_visual.png'],
    },
  };
}
```

---

## 2. Structured Metadata Tag Support

- **Open Graph (OG)**: Correctly registers key meta tag parameters (`title`, `description`, `type: 'website'`, `images: ['/uploads/hero_visual.png']`).
- **Twitter Cards**: Implements the `summary_large_image` template.
- **Base Domain URL**: Maps to the production domain address `https://vance.engineering`.

---

## 3. Semantic Layout Elements & SEO Gaps

- **Semantic HTML**: Uses appropriate semantic elements (e.g., `<header>`, `<main>`, `<section>`, `<footer>`).
- **Heading Order**: Uses a single `<h1>` on the landing page and blog pages, maintaining correct hierarchy (`<h1>` to `<h3>` transitions).
- **Missing SEO Elements**:
  - **Canonical Tags**: The metadata returns do not specify canonical links for dynamic blog pages, exposing the site to duplicate content issues if accessed via different subdomains.
  - **Sitemaps (`sitemap.xml`) & Robots configuration (`robots.txt`)**: "Not Found." The project does not configure dynamic XML sitemaps generator scripts or robots indexing instructions.
  - **Structured Data JSON-LD Schemas**: The site lacks JSON-LD tags for articles, portfolios, or professional services, which limits Rich Snippet representation in Google search results.
