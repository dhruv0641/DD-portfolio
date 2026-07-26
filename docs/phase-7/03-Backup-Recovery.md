# Backup & Recovery Runbook

## Overview
This runbook details the database backup procedures, storage bucket backup routines, and step-by-step restoration workflows.

## Backup Policies

### 1. Database Backups (Supabase)
- **Automatic Backups**: Supabase performs daily physical backups of your PostgreSQL database automatically.
- **Manual Backups**: Run the following pg_dump command to export a local copy of database rows:
  ```bash
  pg_dump -h db.your-project-ref.supabase.co -U postgres -d postgres -F c -b -v -f portfolio_backup.sql
  ```

### 2. Storage Buckets Backups
- Media files in public buckets should be mirrored to an offline backup directory monthly. Run a synchronization script via Supabase CLI:
  ```bash
  supabase storage pull projects ./backups/storage/projects
  ```

## Disaster Recovery Protocol
In the event of a system compromise or database failure, execute the following restoration workflow:
1. Re-provision the database using migration schemas: [0001_init_schema.sql](file:///d:/portfolio/supabase/migrations/0001_init_schema.sql).
2. Restore database rows from the latest SQL backup:
   ```bash
   pg_restore -h db.your-project-ref.supabase.co -U postgres -d postgres -v portfolio_backup.sql
   ```
3. Re-upload backup media assets to their respective storage buckets.
