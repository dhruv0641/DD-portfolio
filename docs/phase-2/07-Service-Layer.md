# Service Layer Architecture

## Overview

The service layer (`src/services/`) abstracts all Supabase database operations behind clean TypeScript interfaces. This separation ensures:

- Page components and Server Actions never interact with Supabase directly
- Database queries are centralized and reusable
- Swapping the backend (e.g., to a different database) requires changes only in the service layer

## Service Inventory

| Service | File | Table | Operations |
|---|---|---|---|
| `authService` | `authService.ts` | Supabase Auth | signUp, signIn, signOut, getSession |
| `projectService` | `projectService.ts` | `projects` | getProjects, getProjectBySlug, saveProject, deleteProject |
| `blogService` | `blogService.ts` | `blogs` | getBlogPosts, getPostBySlug, saveBlogPost, deleteBlogPost |
| `settingsService` | `settingsService.ts` | `site_settings` | getSettings, getSettingsList, saveSettings |
| `profileService` | `profileService.ts` | `profiles` | getProfile, saveProfile |
| `skillService` | `skillService.ts` | `skill_categories`, `skills` | getCategories, getSkills, saveSkill, deleteSkill |
| `experienceService` | `experienceService.ts` | `experience` | getExperiences, saveExperience, deleteExperience |
| `educationService` | `educationService.ts` | `education` | getEducation, saveEducation, deleteEducation |
| `certificateService` | `certificateService.ts` | `certificates` | getCertificates, saveCertificate, deleteCertificate |
| `contactService` | `contactService.ts` | `messages` | getMessages, submitMessage, updateMessageStatus, deleteMessage |
| `storageService` | `storageService.ts` | `storage.objects` | uploadFile, deleteFile |

## Client Usage Pattern

### Read Operations (Public)
All read operations use the **anonymous Supabase client** (`supabase`), which respects RLS policies:

```typescript
// Example: Fetch published blog posts
const { data, error } = await supabase
  .from('blogs')
  .select('*')
  .eq('is_draft', false)
  .eq('status', 'active')
  .order('created_at', { ascending: false });
```

### Write Operations (Admin)
All write operations use the **admin Supabase client** (`getSupabaseAdmin()`), which bypasses RLS:

```typescript
// Example: Update a project
const admin = getSupabaseAdmin();
const { error } = await admin
  .from('projects')
  .update(payload)
  .eq('id', projectId);
```

## Data Mapping Convention

Supabase returns rows with PostgreSQL snake_case column names. Services map these to camelCase TypeScript interfaces:

| Database Column | TypeScript Property |
|---|---|
| `content_markdown` | `contentMarkdown` |
| `tech_stack` | `techStack` |
| `is_draft` | `isDraft` |
| `published_at` | `publishedAt` |
| `reading_time` | `readingTime` |
| `created_at` | `createdAt` (where mapped) |

> [!NOTE]
> Not all services perform camelCase mapping. Admin CMS components that consume raw Supabase rows use snake_case property access directly (e.g., `msg.created_at`).

## Error Handling Pattern

All services follow a consistent error handling pattern:

```typescript
async operation(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await admin.from('table').insert([payload]);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Operation failed.' };
  }
}
```

Read operations return empty arrays/objects on failure, with `console.error` logging for debugging.
