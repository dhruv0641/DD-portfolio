# Row Level Security (RLS) Policies

## Overview

Every table in the schema has RLS enabled. Policies enforce a strict two-tier access model:

1. **Anonymous (public)**: Read-only access to published/active records
2. **Authenticated (admin)**: Full CRUD access to all records

## Policy Matrix

| Table | Anonymous SELECT | Anonymous INSERT | Authenticated (All) | Filter Condition |
|---|---|---|---|---|
| `profiles` | ✅ | ❌ | ✅ | `status = 'active'` |
| `skill_categories` | ✅ | ❌ | ✅ | `status = 'active'` |
| `skills` | ✅ | ❌ | ✅ | `status = 'active'` |
| `projects` | ✅ | ❌ | ✅ | `is_draft = false AND status = 'active'` |
| `experience` | ✅ | ❌ | ✅ | `status = 'active'` |
| `education` | ✅ | ❌ | ✅ | `status = 'active'` |
| `certificates` | ✅ | ❌ | ✅ | `status = 'active'` |
| `blogs` | ✅ | ❌ | ✅ | `is_draft = false AND status = 'active'` |
| `testimonials` | ✅ | ❌ | ✅ | `status = 'active'` |
| `services` | ✅ | ❌ | ✅ | `status = 'active'` |
| `seo` | ✅ | ❌ | ✅ | `status = 'active'` |
| `site_settings` | ✅ | ❌ | ✅ | `status = 'active'` |
| `messages` | ❌ | ✅ | ✅ | Insert: unrestricted |
| `analytics_events` | ❌ | ✅ | ✅ (SELECT only) | Insert: unrestricted |

## Policy Details

### Content Tables (profiles, skills, experience, education, certificates, testimonials, services, seo, site_settings)
- **Public SELECT**: Filtered by `status = 'active'` — deleted or archived records are invisible
- **Admin ALL**: Full insert, update, delete access for authenticated users

### Draft-Aware Tables (projects, blogs)
- **Public SELECT**: Filtered by `is_draft = false AND status = 'active'` — only published and active records are visible
- **Admin ALL**: Full access including drafts, for CMS management

### User-Generated Content (messages, analytics_events)
- **Anonymous INSERT**: Anyone can submit contact forms and trigger analytics events
- **No anonymous SELECT**: Visitors cannot read other visitors' messages or analytics data
- **Admin**: Full read (and write) access for inbox management

## Security Considerations

> [!IMPORTANT]
> The admin client (`getSupabaseAdmin()`) uses the **service role key** which bypasses all RLS policies. This is intentional — admin Server Actions need unrestricted write access. The service role key is never sent to the browser.

> [!WARNING]
> RLS policies on `messages` allow **unrestricted anonymous inserts**. Rate limiting should be implemented at the application layer (Server Actions) to prevent spam abuse.
