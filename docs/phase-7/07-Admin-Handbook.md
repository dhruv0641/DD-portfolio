# Admin Handbook (CMS Manual)

## Overview
This manual provides the website owner with step-by-step instructions to manage the portfolio using the custom Admin CMS Dashboard.

## Key CMS Workflows

### 1. Profile & Bio Adjustments
1. Navigate to `/admin/profile`.
2. Update your bio, email, availability, and social links.
3. Click **SAVE DETAILS** to sync changes to the database.

### 2. Uploading & Replacing a Resume
1. In the sidebar, select **Media Library**.
2. Select the `resume` bucket and upload your new PDF.
3. Copy the file URL and paste it into the **Resume URL** field in the Profile editor.

### 3. Publishing Project Case Studies
1. Navigate to `/admin/projects` and click **CREATE NEW PROJECT**.
2. Fill in the title, timeline, tags, and metrics (in JSON format, e.g. `[{"value": "90%", "label": "Retention"}]`).
3. Set the status to **Active** to publish it, or **Inactive** to save as a draft.

### 4. Managing Blogs & Slugs
1. Navigate to `/admin/blog` and click **NEW ARTICLE**.
2. Enter the title, description, and write content using standard Markdown syntax.
3. Create a unique, URL-safe slug (e.g. `scaling-multi-agent-systems`).
4. Click **Publish** to make the article public.
