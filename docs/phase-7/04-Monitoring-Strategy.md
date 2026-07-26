# Monitoring Strategy

## Overview
This document outlines the monitoring strategy for application availability, database load, authentication metrics, and exception logging.

## Core Monitoring Metrics

### 1. Application Availability (Uptime)
- **Tool**: UptimeRobot, Pingdom, or Better Uptime.
- **Metric**: Check homepage `/` and `/blog` routes every 1 minute. Alert SREs immediately on HTTP statuses `>=500`.

### 2. Error & Exception Tracking
- **Tool**: Sentry or LogRocket.
- **Configuration**: Capture client-side layout warnings and Server Actions database transaction exceptions.

### 3. API & Supabase Health
- Monitor read/write execution times on PostgreSQL tables. Alert if CPU load exceeds 80% or storage usage reaches 90% of your plan limit.

### 4. Admin Security Logs
- Monitor the `activity_logs` table daily for:
  - Repeated failed login attempts.
  - Rate limit violations (`RATE_LIMIT_VIOLATION` events).
  - Deletions of project files or certificate assets.
