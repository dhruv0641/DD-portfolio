# Project Audit: 08 - Admin System

This report details the admin console components, settings persistence, and CMS modules.

## 1. System Layout & Controls

The administration panel interface is defined in [src/app/admin/layout.tsx](file:///d:/portfolio/src/app/admin/layout.tsx) and features a unified sidebar.

- **Theme Dynamic Syncing**: Ingests colors (e.g. background, surface, accent color, borders radius) and animation preferences (film grain overlay, spotlight, canvas wave) from the database and updates custom properties dynamically.
- **Admin Layout Session Protection**: Redirects unauthorized visitors requesting secure dashboard views to `/admin/login`.

---

## 2. Integrated Admin Modules

| Module Path | Primary Responsibility | Data Mutations |
| :--- | :--- | :--- |
| **Dashboard Overview**<br>[src/app/admin/dashboard](file:///d:/portfolio/src/app/admin/dashboard/page.tsx) | Displays core portfolio performance metrics: total visits count, click logs, submission conversion rates, and a quick-view message table. | None (Queries analytics events & messages). |
| **Projects CMS**<br>[src/app/admin/projects](file:///d:/portfolio/src/app/admin/projects/ProjectsCMS.tsx) | Registers and edits case study details (titles, slugs, roles, timelines, metrics arrays, impact counters, and visibility drafts). | Calls `saveProject()`, `deleteProject()`, and `updateProjectOrder()`. |
| **Writing CMS**<br>[src/app/admin/blog](file:///d:/portfolio/src/app/admin/blog/BlogCMS.tsx) | Compiles and edits technical essays in Markdown format. | Calls `saveBlogPost()` and `deleteBlogPost()`. |
| **Messages Inbox**<br>[src/app/admin/messages](file:///d:/portfolio/src/app/admin/messages/MessagesCMS.tsx) | Lists visitor messages. Allows operators to inspect message bodies, filter by status, archive entries, or mark as spam. | Calls `updateMessageStatus()` and `deleteMessage()`. |
| **System Settings**<br>[src/app/admin/settings](file:///d:/portfolio/src/app/admin/settings/SettingsCMS.tsx) | Configures global values (operator name, biography, color hex values, spotlight visibility, and smooth scroll behaviors). | Calls `saveSettings()`. Automatically converts hex accent codes to RGB colors (e.g., `#0066FF` to `0, 102, 255`). |

---

## 3. Analytics Tracking & Reporting

- **Visits Metric**: Extracted by querying the `analyticsEvents` database table filtering by `eventType = 'visit'`.
- **CTA Actions**: Counted by filtering `analyticsEvents` by `eventType = 'cta_click'`.
- **Conversion Calculations**: Computed dynamically inside [src/app/admin/dashboard/page.tsx:L24](file:///d:/portfolio/src/app/admin/dashboard/page.tsx#L24):
  $$\text{Conversion Rate} = \frac{\text{Total Messages}}{\text{Total Visits}} \times 100$$
- **Audit Logs / Feature Flags / Billing System**: "Not Found." All operations are stored in the main schema tables without secondary auditing logs.
