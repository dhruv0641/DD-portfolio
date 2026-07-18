# Project Audit: 25 - Feature Matrix

This report inventories the core features, implementation statuses, priorities, and ownership mappings.

## 1. System Feature Inventory

| Feature | Description | Status | Complete % | Priority | Dependencies | Used By | Tech Debt | Owner |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| **Theme Customization** | Configures global UI styles (accent colors, radius settings, film grain overlays, and animations) dynamically from the database. | Active | 100% | Critical | `ThemeProvider`, `settings` DB table | Main layout headers, canvas overlays, and components. | Hex-to-RGB parsing is handled synchronously on form submit. | Dhruv Dobariya |
| **Projects CMS** | Manages showcase lists, timeline metadata, screenshots, and custom metrics tags. | Active | 95% | High | `saveProject`, `projects` DB table | Landing page case study grid. | UI tables lack responsive card lists on mobile screens. | Dhruv Dobariya |
| **Writing CMS** | Markdown editor for drafting and publishing journal articles. | Active | 95% | High | `saveBlogPost`, `blogPosts` DB table | Blog pages and public essay readers. | Markdown is parsed using simple string regex matching instead of a robust parser library. | Dhruv Dobariya |
| **Inbound Message Capture** | Visitor contact form with honeypot verification and optional Formspree webhook forwarding. | Active | 100% | Critical | `submitContactForm`, `messages` DB table | `#build` footer form section. | Public submissions lack rate-limiting boundaries. | Dhruv Dobariya |
| **Admin Analytics Console** | Displays total visits count, click logs, and lead conversion rates. | Active | 90% | Medium | `analyticsEvents` DB table | `/admin/dashboard` panel view. | Simplistic metrics without deep data filters. | Dhruv Dobariya |
| **Secure Authentication** | Session management using JWT signatures and secure cookies. | Active | 80% | Critical | `jose`, `bcryptjs`, `users` DB table | `/admin` routes. | Next.js Middleware is bypassed, relying on page-level authentication checks. | Dhruv Dobariya |
| **Math Canvas Animation** | Animated wave graphics running on an active HTML5 canvas container. | Active | 100% | Low | `ThoughtWave`, HTML5 Canvas API | Landing page hero block. | High CPU usage on legacy hardware. | Dhruv Dobariya |
