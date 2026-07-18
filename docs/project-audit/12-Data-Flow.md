# Project Audit: 12 - Data Flow

This report details data flow sequences for transactions, updates, and layout synchronization.

## 1. Contact Form Submission Flow

```mermaid
sequenceDiagram
    autonumber
    actor Visitor
    participant View as ContactForm (Client Component)
    participant Action as submitContactForm (Server Action)
    participant DB as SQLite Database
    participant Ext as External Webhook (Formspree)

    Visitor->>View: Enter details and click submit
    Note over View: Client-side validation: <br/>Name length check, email regex validation, message length check.
    alt Client Validation Fails
        View-->>Visitor: Focus first invalid input and display helper error text
    else Client Validation Passes
        View->>Action: Dispatch RPC data payload
        Note over Action: Run Honeypot validation check. <br/>Validate schema bounds.
        alt Server Validation Fails
            Action-->>View: Return { success: false, error: 'Validation failed' }
            View-->>Visitor: Render error box layout
        else Server Validation Passes
            Action->>DB: Insert message record & analytics event
            DB-->>Action: Confirm database transaction
            opt Configuration: CONTACT_FORM_ENDPOINT is active
                Action->>Ext: Dispatch fetch POST request (10s Abort boundary)
                Ext-->>Action: Return response code
            end
            Action-->>View: Return { success: true }
            Note over View: Generate random transaction ID.<br/>Reset form fields.
            View-->>Visitor: Display green confirmation card
        end
    end
```

---

## 2. Dynamic Settings Update Flow

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Admin Operator
    participant CMS as SettingsCMS Form
    participant Action as saveSettings (Server Action)
    participant DB as SQLite Database
    participant Router as Next.js Router Cache

    Admin->>CMS: Edit dynamic accent hex parameters & submit
    Note over CMS: Parse settings object into key/value list. <br/>Compute RGB values if color changes.
    CMS->>Action: Dispatch settings updates list
    Action->>DB: Execute settings table update query
    DB-->>Action: Confirm SQL transaction
    Action->>Router: revalidatePath('/') & revalidatePath('/blog')
    Note over Router: Mark cache directories as stale. <br/>Rebuild views.
    Action-->>CMS: Return { success: true }
    CMS->>Admin: Show success alert & update ThemeProvider CSS variables
```

---

## 3. Realtime Updates, Retries, & Optimistic UI

- **Realtime Support**: **Not Configured.** The application does not use WebSockets, Server-Sent Events, or polling models (e.g. SWR/TanStack query polling). Visitors must manually refresh their browsers to fetch new blog articles or updated case studies.
- **Optimistic Updates**: **Not Configured.** The CMS panels display loading states during Server Action execution and wait for database transaction confirmations before updating list views.
- **Retry Mechanics**: Client forms do not implement automated retry policies on network failures. However, the external webhook forwarder inside [src/app/actions/contact.ts](file:///d:/portfolio/src/app/actions/contact.ts) features a `10-second` timeout boundary to prevent request hangs.
