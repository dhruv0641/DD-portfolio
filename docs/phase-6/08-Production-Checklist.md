# Production Checklist

## Overview
This document logs the configuration requirements needed before pointing DNS records to the production environment.

## Deployment Tasks

- [x] **Compile Check**: Confirm Next.js build passes.
- [ ] **Rotate Default Secret Key**: Update `ADMIN_JWT_SECRET` in production env variables.
- [ ] **Auth Database Default Rotation**: Log into Supabase and update default administrative credentials.
- [ ] **Verify Contact Form Endpoints**: Check that `CONTACT_FORM_ENDPOINT` matches production Formspree/Web3Forms keys.
- [ ] **Domain Redirection**: Configure HSTS and force HTTP traffic to redirect to HTTPS.
- [ ] **Lighthouse Baseline Check**: Verify post-deployment Lighthouse score matches pre-release metrics.
