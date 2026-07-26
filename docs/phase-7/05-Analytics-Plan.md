# Analytics Implementation Plan

## Overview
This document specifies how to measure site traffic, project clicks, and resume downloads using privacy-friendly tools.

## Implementation Guidelines

### 1. Privacy First Tracking
- **Tools**: Plausible Analytics, Umami, or Vercel Web Analytics.
- **Rules**: Do not track PII (Personally Identifiable Information). Avoid using cookies that require user consent banners (compliant with GDPR/CCPA).

### 2. Event Tracking Specifications

| Event Name | Trigger Context | Target Element | Measurement Goal |
|---|---|---|---|
| `project_view` | Project visual card click | `a[href="#work"]` | Measure project popularity |
| `resume_download` | Resume file download | `a[href*="/resume"]` | Track recruiter downloads |
| `contact_submit` | Form submission success | `#contact-form` | Measure client inquiries |
| `blog_read` | Blog post view | `/blog/[slug]` | Measure readership |

### 3. Implementation Code Example (Umami)
Place the following code snippet in your layout to enable tracking:
```html
<script 
  async 
  defer 
  data-website-id="YOUR-WEBSITE-ID" 
  src="https://analytics.yourdomain.com/umami.js"
></script>
```
