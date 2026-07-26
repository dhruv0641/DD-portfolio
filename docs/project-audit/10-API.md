# Project Audit: 10 - API Audit

This report documents the RPC Server Actions interface, input/output structures, and verification layers.

## 1. API Paradigm and Invocation Mechanism

The application does not expose REST endpoints (such as `/api/v1/projects`). Instead, communication is powered by **Next.js Server Actions**. 

Server Actions act as POST endpoints executing remote procedure calls (RPC) with automated serialization. The client invokes these asynchronous functions directly from form callbacks or component event listeners.

---

## 2. Server Action Endpoint Reference

### 2.1 `loginAdmin`
- **Source Location**: [src/app/actions/login.ts:L9](file:///d:/portfolio/src/app/actions/login.ts#L9)
- **Purpose**: Authenticates admin operators and issues a session cookie.
- **Inputs**:
  - `formData`: `{ username: string, password: string }`
- **Outputs**:
  - Success: `{ success: true }`
  - Failure: `{ success: false, error: string }`
- **Validation**: Enforces non-empty values for both inputs.
- **Authentication Required**: No.
- **Consumers**: `LoginForm.tsx` component.

### 2.2 `logoutAdmin`
- **Source Location**: [src/app/actions/login.ts:L58](file:///d:/portfolio/src/app/actions/login.ts#L58)
- **Purpose**: Destroys active session cookies.
- **Inputs**: None.
- **Outputs**: `{ success: true }`
- **Validation**: None.
- **Authentication Required**: No.
- **Consumers**: `LogoutButton.tsx` sidebar component.

### 2.3 `submitContactForm`
- **Source Location**: [src/app/actions/contact.ts:L14](file:///d:/portfolio/src/app/actions/contact.ts#L14)
- **Purpose**: Processes public contact inquiries, logs telemetry, and triggers external notifications.
- **Inputs**:
  - `data`: `{ name: string, email: string, objective: string, details: string, website?: string }`
- **Outputs**:
  - Success: `{ success: true }`
  - Failure: `{ success: false, error: string }`
- **Validation**:
  - Checks honeypot field (`website` must be empty).
  - Enforces `name` length of 2+ characters.
  - Enforces valid email pattern check.
  - Enforces `details` length of 10+ characters.
- **Authentication Required**: No (Public access).
- **Consumers**: `ContactForm.tsx` component.

### 2.4 `saveBlogPost`
- **Source Location**: [src/app/actions/blog.ts:L10](file:///d:/portfolio/src/app/actions/blog.ts#L10)
- **Purpose**: Creates or modifies journal articles.
- **Inputs**:
  - `formData`: `{ id?: number, title: string, slug: string, contentMarkdown: string, categories: string | string[], tags: string | string[], isDraft: number | boolean }`
- **Outputs**: `{ success: true }` or `{ success: false, error: string }`
- **Validation**: Requires non-empty values for `title`, `slug`, and `contentMarkdown`.
- **Authentication Required**: Yes (`verifyAuthSession()` validation).
- **Consumers**: `BlogCMS.tsx` management dashboard.

### 2.5 `deleteBlogPost`
- **Source Location**: [src/app/actions/blog.ts:L67](file:///d:/portfolio/src/app/actions/blog.ts#L67)
- **Purpose**: Permanently deletes journal entries.
- **Inputs**: `id: number`
- **Outputs**: `{ success: true }` or `{ success: false, error: string }`
- **Authentication Required**: Yes (`verifyAuthSession()` validation).
- **Consumers**: `BlogCMS.tsx`.

### 2.6 `saveProject`
- **Source Location**: [src/app/actions/projects.ts:L9](file:///d:/portfolio/src/app/actions/projects.ts#L9)
- **Purpose**: Creates or updates project case study configurations.
- **Inputs**: Form parameters mapped to table schema structures.
- **Outputs**: `{ success: true }` or `{ success: false, error: string }`
- **Validation**: Enforces non-empty values for `title` and `slug`.
- **Authentication Required**: Yes.
- **Consumers**: `ProjectsCMS.tsx`.

### 2.7 `deleteProject`
- **Source Location**: [src/app/actions/projects.ts:L84](file:///d:/portfolio/src/app/actions/projects.ts#L84)
- **Purpose**: Deletes custom case study records.
- **Inputs**: `id: number`
- **Outputs**: `{ success: true }` or `{ success: false, error: string }`
- **Authentication Required**: Yes.
- **Consumers**: `ProjectsCMS.tsx`.

### 2.8 `updateProjectOrder`
- **Source Location**: [src/app/actions/projects.ts:L101](file:///d:/portfolio/src/app/actions/projects.ts#L101)
- **Purpose**: Reorders project list displays.
- **Inputs**: `orderList: { id: number, position: number }[]`
- **Outputs**: `{ success: true }` or `{ success: false, error: string }`
- **Authentication Required**: Yes.
- **Consumers**: `ProjectsCMS.tsx`.

### 2.9 `saveSettings`
- **Source Location**: [src/app/actions/settings.ts:L14](file:///d:/portfolio/src/app/actions/settings.ts#L14)
- **Purpose**: Updates global settings.
- **Inputs**: `settingsList: { key: string, value: string }[]`
- **Outputs**: `{ success: true }` or `{ success: false, error: string }`
- **Authentication Required**: Yes.
- **Consumers**: `SettingsCMS.tsx`.

### 2.10 `deleteMessage` & `updateMessageStatus`
- **Source Location**: [src/app/actions/messages.ts](file:///d:/portfolio/src/app/actions/messages.ts)
- **Purpose**: Manages visitor messages.
- **Authentication Required**: Yes.
- **Consumers**: `MessagesCMS.tsx`.

---

## 3. Security & Rate Limiting Audit

- **Rate Limiting**: **Not Configured.** There is no middleware or rate-limiting block (such as token bucket algorithms or Upstash redis limiters) checking client call frequency on public endpoints like `submitContactForm`. This exposes the SQLite database to potential resource exhaustion if targeted by automated script loops.
- **Validation Fallback**: Server actions implement validation checks parallel to client-side forms. This prevents malformed database entries even if client-side validation is bypassed.
