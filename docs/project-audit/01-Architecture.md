# Project Audit: 01 - Application Architecture

This report details the architectural blueprint of the Applied AI Portfolio engine.

## 1. Architectural System Diagram

```mermaid
graph TD
    %% Clients
    subgraph Client [Client Interface - React/Next.js]
        V_UI[Vanilla CSS / Layout Grid]
        L_SC[Lenis Smooth Scroll]
        C_CA[ThoughtWave Canvas / Cursor Aura]
        CF_C[Contact Form Component]
    end

    %% Routing / Middleware
    subgraph Routing [Next.js Route Controller]
        MW[middleware.ts / currently inactive proxy.ts]
        AP[Admin Pages Server-Side Session Check]
    end

    %% App Server
    subgraph Server [Next.js Server - React 19]
        SA_L[Server Action: loginAdmin]
        SA_B[Server Action: saveBlogPost / deleteBlogPost]
        SA_P[Server Action: saveProject / deleteProject]
        SA_C[Server Action: submitContactForm]
        SA_S[Server Action: saveSettings]
    end

    %% Database / Storage
    subgraph DB [Data Persistence Layer]
        DR_C[Drizzle SQLite Client]
        SQ_DB[(local.db - LibSQL / SQLite)]
    end

    %% External APIs
    subgraph External [External Interfaces]
        FS_API[Formspree Webhook endpoint]
    end

    %% Client-Server Relationships
    CF_C -->|Submit payload| SA_C
    CF_C -.->|Direct Fallback Email| FS_API
    V_UI -->|Router requests| AP
    AP -->|Authenticate| SA_L
    
    %% Server Actions to Database
    SA_L -->|Select users| DR_C
    SA_B -->|Insert/Update blog_posts| DR_C
    SA_P -->|Insert/Update projects| DR_C
    SA_C -->|Insert messages & analytics_events| DR_C
    SA_S -->|Update settings| DR_C
    
    DR_C --> SQ_DB
    
    %% External Sync
    SA_C -->|Fetch POST message| FS_API
```

---

## 2. Infrastructure Component Breakdown

### 2.1 Client
- **Tech Stack**: React 19.2.4 & Next.js 16.2.10 (App Router).
- **Styling**: Vanilla CSS utilizing custom tailwind directives (`@import "tailwindcss"`) and variables bound dynamically to React state via [src/components/ThemeProvider.tsx](file:///d:/portfolio/src/components/ThemeProvider.tsx).
- **Core Interactions**: 
  - Smooth animation interpolation via [Lenis](file:///d:/portfolio/src/components/LenisProvider.tsx).
  - Neural visual modeling via [ThoughtWave](file:///d:/portfolio/src/components/ThoughtWave.tsx) Canvas.
  - Spotlight coordinate tracking via [LightProbe](file:///d:/portfolio/src/components/LightProbe.tsx) cursor auric gradients.

### 2.2 Server
- **Tech Stack**: Next.js App Router acting as a Node.js runtime host.
- **Server Actions**: Serves as the primary transaction layer for writing database changes and revalidating public layouts immediately without page reloads.

### 2.3 API
- **Endpoint Design**: Utilizes type-safe Server Actions (`"use server"`) instead of traditional REST endpoint handlers. This reduces route configuration boilerplate but limits native cross-origin external API calls without customized CORS header routing.

### 2.4 Database
- **Engine**: SQLite / LibSQL hosted in local workspace (`local.db`).
- **Client**: `drizzle-orm` (configured in [drizzle.config.ts](file:///d:/portfolio/drizzle.config.ts) and initialized in [src/db/index.ts](file:///d:/portfolio/src/db/index.ts)).

### 2.5 Authentication & Authorization
- **Verification Flow**: Compares credentials against hashed password parameters using `bcryptjs` and signs lightweight session tokens using `jose`. Tokens are written into HttpOnly, Secure, Lax session cookies.

### 2.6 Third-Party Integrations
- **Formspree / Web3Forms**: Contact form submission redirects to `CONTACT_FORM_ENDPOINT` if configured in the environment variables, ensuring email delivery fallback.

---

## 3. Data Flow Model

```mermaid
sequenceDiagram
    autonumber
    actor User as Operator Client
    participant Server as Next.js Server Action
    participant DB as Drizzle SQLite Database
    participant Cache as Route Cache (ISR)

    User->>Server: submitContactForm(data)
    Note over Server: Spam Honeypot Check<br/>Validation check (Name/Email/Details)
    Server->>DB: Insert message row & event entry
    DB-->>Server: Confirm SQL Insert OK
    opt External Webhook Delivery
        Server->>Server: trigger fetch(CONTACT_FORM_ENDPOINT)
    end
    Server->>Cache: revalidatePath('/admin/dashboard')
    Server-->>User: Return { success: true }
```
- **Static Site Regeneration**: When dynamic elements (settings, projects, blogs) are updated inside the Admin panel, paths are revalidated instantly using `revalidatePath` to refresh the ISR Cache structure.
