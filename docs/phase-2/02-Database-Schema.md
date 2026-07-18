# Database Schema Reference

## Overview

The Phase 2 PostgreSQL schema consists of **14 tables** designed for a fully dynamic portfolio CMS. All tables use UUID primary keys (`uuid_generate_v4()`), ISO 8601 timestamps, and a `status` field for soft-delete capability.

## Table Inventory

| # | Table | Purpose | Key Fields |
|---|---|---|---|
| 1 | `profiles` | Owner bio, title, contact | name, title, bio, contact_email, location |
| 2 | `skill_categories` | Skill group labels | name, position |
| 3 | `skills` | Individual technical skills | category_id (FK), name, proficiency, position |
| 4 | `projects` | Portfolio case studies | title, slug, tech_stack (JSONB), metrics (JSONB), screenshots (JSONB) |
| 5 | `experience` | Professional timeline | role, company, timeline, description |
| 6 | `education` | Academic history | degree, institution, timeline |
| 7 | `certificates` | Certifications with animated scores | title, issuer, score, suffix |
| 8 | `blogs` | Journal/essay posts | title, slug, content_markdown, categories (JSONB), tags (JSONB), reading_time |
| 9 | `testimonials` | Client testimonials | client_name, client_role, text |
| 10 | `services` | Service offerings | name, description, icon |
| 11 | `seo` | SEO meta configuration | meta_description, og_image, twitter_card |
| 12 | `site_settings` | Key-value site configuration | category, key, value |
| 13 | `messages` | Contact form inbox | name, email, objective, details, status |
| 14 | `analytics_events` | Visitor tracking | event_type, path, referrer, device, country |

## Column Conventions

- **`id`**: UUID primary key, auto-generated
- **`created_at`**: `TIMESTAMP WITH TIME ZONE`, defaults to current UTC
- **`updated_at`**: `TIMESTAMP WITH TIME ZONE`, defaults to current UTC
- **`status`**: Soft-delete mechanism (`'active'` / `'archived'` / `'deleted'`)
- **`position`**: Integer ordering field for sortable lists
- **JSONB columns**: Used for arrays/objects (tech_stack, metrics, screenshots, categories, tags)

## Foreign Key Relationships

```
skill_categories 1──M skills (category_id → skill_categories.id, CASCADE DELETE)
```

All other tables are standalone entities without cross-table foreign keys, keeping the schema flat and easily manageable for a single-tenant portfolio.

## Data Types

| PostgreSQL Type | Usage |
|---|---|
| `UUID` | Primary keys and foreign keys |
| `TEXT` | All string fields (unlimited length) |
| `INTEGER` | Proficiency scores, reading time, position ordering |
| `BOOLEAN` | Flags (is_draft, is_featured, is_pinned) |
| `JSONB` | Structured arrays/objects (tech_stack, metrics, categories) |
| `TIMESTAMP WITH TIME ZONE` | All date/time fields |
