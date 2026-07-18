# Long-Term Maintenance Guide

## Overview
This guide schedules recurring maintenance tasks to ensure the portfolio remains secure, up-to-date, and performant.

## Schedule Matrix

### 1. Weekly Tasks
- **Check Audit Logs**: Review the `activity_logs` dashboard for failed login attempts or rate-limit violations.
- **Inbox Review**: Check for new inquiries in the admin inbox.

### 2. Monthly Tasks
- **Verify Backups**: Download a pg_dump file and test restoring it to a local development environment.
- **Dependency Audit**: Run `npm outdated` and update minor package versions.
- **Security Check**: Run `npm audit` to check for known package vulnerabilities.

### 3. Quarterly Tasks
- **Performance Review**: Run a Lighthouse check on the home and blog routes.
- **Clean Storage**: Delete orphan files or unused images from Supabase Storage buckets.

### 4. Yearly Tasks
- **Major Upgrades**: Plan updates for Next.js and Supabase major versions.
- **Domain Renewal**: Verify domain auto-renewal is active.
