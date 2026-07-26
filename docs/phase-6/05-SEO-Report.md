# SEO Indexing & Search Audit

## Overview
This document evaluates metadata parameters, structured schemas, dynamic sitemaps, and indexing status.

## Audit Metrics

### 1. Dynamic Sitemap (`/sitemap.xml`)
- Evaluated generator: queries published projects and blogs automatically to populate search paths.

### 2. Crawl Directives (`/robots.txt`)
- Allows indexation of public portfolio sections while blocking admin panels (`/admin/`) from index scans.

### 3. OG/Twitter Cards
- Metadata properties (`og:title`, `og:description`, `twitter:card`) are configured dynamically inside `src/app/layout.tsx` to generate preview cards for sharing.
