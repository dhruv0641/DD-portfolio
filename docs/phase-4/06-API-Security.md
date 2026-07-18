# API Security & Sanitization Review

## Overview
This document reviews the API security boundary, request sanitization, error obfuscation, and rate limiting controls.

## Server Actions Input Sanitization

### 1. XSS Mitigation
All string inputs are processed through `sanitizeString()` inside Server Actions. This escapes HTML character tokens:
- `<` converted to `&lt;`
- `>` converted to `&gt;`
- `"` converted to `&quot;`
- `'` converted to `&#x27;`
- `/` converted to `&#x2F;`
This prevents script injection payloads from executing in client views (Stored XSS).

### 2. SQL Injection Defenses
Supabase queries use PostgreSQL parameter binding automatically. This isolates query structures from input strings, neutralizing SQL Injection.

## Rate Limiting Matrix

In-memory rate limiters protect the following sensitive endpoints:

| Action Key | Max Tokens | Refill Rate | Time Window | Action on Violation |
|---|---|---|---|---|
| `login` | 5 | 0.3 tokens / min | 15 minutes | Reject + Log event |
| `password_reset_request` | 3 | 0.05 tokens / min | 60 minutes | Reject |
| `password_reset_perform` | 5 | 0.08 tokens / min | 60 minutes | Reject |
| `contact_form` | 3 | 0.05 tokens / min | 60 minutes | Reject |
| `media_upload` | 10 | 1.0 tokens / min | 10 minutes | Reject |

## Error Leakage Prevention
Server Actions catch internal database errors and output structured generic responses (e.g., `'Failed to submit inquiry'`) instead of raw stack traces. Detailed logs are captured only in server logs for admin troubleshooting.
