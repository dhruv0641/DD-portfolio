# Storage Security Audit

## Overview
This document reviews the security boundaries, bucket classifications, and upload restrictions applied to the Supabase Storage system.

## Storage Bucket Inventory & Policies

| Bucket | Access | Allowed MIME Types | Max Size | RLS Read Policy | RLS Write Policy |
|---|---|---|---|---|---|
| `profile-images`| Public | Image files | 5MB | Unrestricted | Authenticated only |
| `hero-images` | Public | Image files | 5MB | Unrestricted | Authenticated only |
| `projects` | Public | Image files | 5MB | Unrestricted | Authenticated only |
| `blog-images` | Public | Image files | 5MB | Unrestricted | Authenticated only |
| `certificates` | Public | Image files | 5MB | Unrestricted | Authenticated only |
| `resume` | Public | PDF files | 5MB | Unrestricted | Authenticated only |
| `site-assets` | Public | Icon / Image files | 5MB | Unrestricted | Authenticated only |
| `documents` | Private | PDF / Doc files | 10MB | Authenticated only | Authenticated only |

## Upload Validation Engine
When an administrator uploads a file, the `uploadMediaFile` Server Action performs the following:
1. **Bucket Whitelisting**: Rejects uploads to target buckets outside the approved list.
2. **File Extension Validation**: Blocks executable or web-interpretable extensions (`.js`, `.html`, `.exe`, `.php`).
3. **Magic Numbers Signature Checking**: Inspects the base64 prefix signature to verify the file is actually an image or PDF.
4. **Filename Randomization**: Generates a random UUID filename to prevent directory traversal exploits.
