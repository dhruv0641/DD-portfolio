# Storage Architecture

## Overview

Supabase Storage is configured with **11 buckets** for organizing media assets. All portfolio-related buckets are public (allow anonymous reads), while the `documents` bucket is private.

## Bucket Inventory

| Bucket | Public | Purpose |
|---|---|---|
| `profile-images` | ✅ | Owner avatar, headshots |
| `hero-images` | ✅ | Hero section backgrounds and visuals |
| `projects` | ✅ | Project screenshots and case study assets |
| `gallery` | ✅ | General image gallery |
| `blog-images` | ✅ | Blog post featured images and inline media |
| `certificates` | ✅ | Certificate badge images |
| `resume` | ✅ | Downloadable resume/CV files |
| `documents` | ❌ | Private administrative documents |
| `site-assets` | ✅ | Favicon, logos, OG images |
| `logos` | ✅ | Company/technology logos |
| `icons` | ✅ | UI icon assets |

## RLS Policies

### Public Buckets
- **Anonymous SELECT**: Allowed for all 10 public buckets
- Files are accessible via Supabase public URLs without authentication

### All Buckets
- **Authenticated ALL**: Admin users can upload, update, and delete files in any bucket

## Storage Service

The `src/services/storageService.ts` module provides two operations:

### `uploadFile(bucket, path, file)`
- Uploads a `File` object to the specified bucket and path
- Uses `upsert: true` to overwrite existing files
- Returns the public URL on success

### `deleteFile(bucket, path)`
- Removes a file from the specified bucket
- Used during project/blog cleanup operations

## URL Format

Public file URLs follow the pattern:
```
{SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}
```

## Usage Example

```typescript
import { storageService } from '@/services/storageService';

// Upload a project screenshot
const result = await storageService.uploadFile(
  'projects',
  'kombee/screenshot-01.png',
  imageFile
);

// Delete an old image
await storageService.deleteFile('projects', 'kombee/old-screenshot.png');
```
