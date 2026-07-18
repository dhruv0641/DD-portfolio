# Project Audit: 24 - Business Logic

This report documents the business rules, validation constraints, and operational flows of the application.

## 1. Core Business Rules

### 1.1 Inbound Lead Capturing & Validation
- **Visitor Objective Identification**: Focuses on collecting inbound messages categorized by the visitor's goal (`objective`), details, name, and email address.
- **Honeypot Validation**: Aborts processing if the hidden `website` input field is populated, protecting the database from automated spam.
- **Form Length Constraints**:
  - Name: Must be $\ge 2$ characters.
  - Details: Must be $\ge 10$ characters.
  - Email: Enforces standard regex pattern checks.
- **Delivery Configuration**: If `CONTACT_FORM_ENDPOINT` is set in the environment, the server forwards submissions to an external processing service (e.g., Formspree). If the call fails or times out (10s limit), the message remains safely logged in the local SQLite database.

---

## 2. Content Visibility & Publishing Rules

- **Draft Constraints**:
  - Blog posts and projects default to `isDraft = 1` (draft status).
  - Draft items are excluded from public lists via `where(eq(isDraft, 0))` filters on client queries.
  - Setting `isDraft = 0` (published status) updates `publishedAt` to the current timestamp and exposes the item publicly.
- **Case Study Presentation Hierarchy**:
  - Public project listings are ordered sequentially using the `position` integer field: `.orderBy(schema.projects.position)`.
  - Administrative lists display items in reverse chronological order: `.orderBy(desc(schema.blogPosts.createdAt))`.
  - The `position` value is updated during saves or catalog reordering actions.

---

## 3. Dynamic Visual Configuration Rules

- **CSS Variable Injection**: System configurations map values (e.g., background color, radius, accent colors) directly to CSS custom properties.
- **Automatic RGB Conversion**: Accent colors must be defined as hexadecimal values (e.g., `#0066FF`). When updated, the server converts the hex code into standard RGB triplets (e.g. `0, 102, 255`) and saves it to `colorAccentRgb`, ensuring compatibility with CSS alpha-channel parameters (`rgba(var(--accent-rgb), 0.2)`).
- **Reduced Motion Constraints**: Setting `reduceMotion = 1` disables smooth scrolling and custom canvas wave animations.
