# Production Readiness Checklist

## Overview
This document lists the required deployment steps to ensure the portfolio is secure when deployed to a live domain.

## Deployment Checklist

- [ ] **HTTPS / SSL Certification**: Ensure the hosting domain enforces HTTP Strict Transport Security (HSTS) and redirects all HTTP traffic to HTTPS.
- [ ] **Rotate JWT Secret**: Define `ADMIN_JWT_SECRET` as a strong, unique 256-bit key in production env configuration. Do not reuse development defaults.
- [ ] **Supabase Service Key Rotation**: Set `SUPABASE_SERVICE_ROLE_KEY` to the production service role. Keep it restricted to the server environment.
- [ ] **Configure Mail Endpoint**: Configure `CONTACT_FORM_ENDPOINT` to a valid Web3Forms or Formspree target to receive email notifications.
- [ ] **CSP Headers Tuning**: Test the CSP configuration in report-only mode to verify no local assets are blocked, then enforce.
- [ ] **Rotate Default Admin Password**: Update default admin credentials inside Supabase Auth database to strong, randomized values.
- [ ] **Set up Rate-limiting Cache**: For high-traffic nodes, replace in-memory Map rate limiting with a Redis or Upstash cache to handle load across serverless functions.
