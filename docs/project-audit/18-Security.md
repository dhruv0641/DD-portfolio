# Project Audit: 18 - Security Audit

This report evaluates security parameters, data sanitization, cookie integrity, and routing vulnerabilities.

## 1. Vulnerability Matrix

| Attack Vector | Vulnerability Rating | Audit Findings and Mitigation Measures |
| :--- | :---: | :--- |
| **SQL Injection** | **Low (Mitigated)** | Parameter inputs are compiled into structured SQLite queries via `drizzle-orm` instead of executing raw SQL string combinations. |
| **Cross-Site Scripting (XSS)** | **Medium-High** | Public blog contents are rendered directly using: `dangerouslySetInnerHTML={formattedContent}` in [src/app/blog/[slug]/page.tsx:L96](file:///d:/portfolio/src/app/blog/[slug]/page.tsx#L96). Although article markdown content is managed via the admin console, if an administrator account is compromised, attackers can inject malicious `<script>` tags directly into blog markdown fields. |
| **CSRF** | **Low-Medium** | Server Actions run automatic CORS and origin validation checks. The session cookie is configured with: `sameSite: 'lax'`, preventing automatic transmission on cross-origin requests. |
| **Middleware Bypass** | **High** | [src/proxy.ts](file:///d:/portfolio/src/proxy.ts) is not loaded as a Next.js middleware because it is not named `middleware.ts`. This leaves `/admin/` subpaths dependent on manual layout validations. |
| **Credential Storage** | **Low** | Credentials stored in the SQLite `users` table are hashed using `bcryptjs` with a work salt factor of 10. |

---

## 2. Session Integrity and Storage Security

### 2.1 Session Cookie Configuration
Session cookies are set in [src/app/actions/login.ts:L43](file:///d:/portfolio/src/app/actions/login.ts#L43):
```typescript
cookieStore.set(getSessionCookieName(), token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24,
});
```
- `httpOnly: true` blocks access to session identifiers from client-side scripts, mitigating credential theft via XSS.
- `sameSite: 'lax'` prevents cookies from being sent on cross-origin requests, reducing CSRF risk.

---

## 3. Secret Management & Key Exposure Risks

- **Static Secret Fallback**: If `ADMIN_JWT_SECRET` is not set in `.env`, the system defaults to:
  `DHRUV_PORTFOLIO_SECURE_SECRET_FALLBACK_KEY_2026`
  This static key is shared across code checkouts, introducing risks if the repository is exposed or shared.
- **Honeypot Spam Protection**: The public contact form includes a hidden `website` input field. If populated (which is common for automated scraping bots that fill all visible fields), the server action logs a warning and aborts database updates.
- **Rate Limiting**: **Not Configured.** The contact form lacks rate limiting (e.g., sliding window filters or redis bucket limits), exposing the database to potential resource exhaustion from automated form submissions.
- **Content Security Policy (CSP)**: **Not Configured.** The next configuration [next.config.ts](file:///d:/portfolio/next.config.ts) does not specify strict security headers like `Content-Security-Policy` or `X-Content-Type-Options`.
