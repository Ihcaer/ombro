# Skema

This repository contains the complete source code for the Skema application, including two frontend services, the core API, and all configuration files, all managed under a unified monorepo structure.

## Structure

| Directory              | Content       | Description                                                |
| :--------------------- | :------------ | :--------------------------------------------------------- |
| `frontend/main/`       | Main Site     | Public-facing application (built with `TBA`).              |
| `frontend/admin/`      | Admin Panel   | Management application (built with Angular/Nx).            |
| `backend/`             | API Service   | Business logic, NestJS, Prisma.                            |
| `docker-compose.*.yml` | Orchestration | Docker files for local, test, and production environments. |
| `.env.example`         | Configuration | Environment variable templates for the Docker stack.       |

## Quick Start (Local Setup)

1.  **Dependencies:** Ensure you have **Docker** and **Docker Compose** installed.
2.  **Configuration:** Copy the example and set environment variables: `cp .env.example .env.local`
3.  **Run:** Start the entire stack: `docker compose -f docker-compose.yml -f docker-compose.local.yml up -d`
4.  **Access:** Main Site: `http://localhost/` (default) | Admin Panel: `http://localhost/admin` (default)

## Copyright and Licensing Notice

**© 2025 Ihcaer. All Rights Reserved. (UNLICENSED)**

**Licensing Terms:**

1.  **This code is NOT released under any Open Source license.** It is explicitly marked as UNLICENSED.
2.  Any copying, modification, redistribution, or utilization of this code or documentation for commercial or private purposes is **strictly prohibited** without the express written consent of the Copyright Holder.
3.  This repository is made publicly visible **for review and informational purposes only.**
