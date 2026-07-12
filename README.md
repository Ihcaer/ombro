[![Netlify Status](https://api.netlify.com/api/v1/badges/a494a725-6339-4745-8edd-ec025ac0ef52/deploy-status)](https://app.netlify.com/projects/demo-ombro/deploys)
![Live Demo](https://img.shields.io/badge/live_preview-test?style=flat&logo=netlify&label=demo&color=00C7B7&link=https%3A%2F%2Fdemo-ombro.netlify.app)

# Skema (Project Ombro)

This repository contains the complete source code for the Skema application, including two frontend services, the core API, and all configuration files, all managed under a unified monorepo structure.

## Frontend live demo

A demo version of the frontend layer is available at the following address:

**[Run live demo](https://demo-ombro.netlify.app)**

> **Technical note:** The live version runs in **Preview/Demo** mode. All HTTP requests to the backend have been mocked (using interceptor). This allows for full testing of the interface and application states without having to launch the database.

### Test account details

The application accepts any login details.

## Structure

| Directory               | Content                 | Description                                                |
| :---------------------- | :---------------------- | :--------------------------------------------------------- |
| `frontend/web/`         | End-user interface      | Public-facing application (built with `TBA`).              |
| `frontend/admin/`       | Admin Panel             | Management application (built with Nx, Angular).           |
| `backend/`              | API Service             | Business logic (built with NestJS, Prisma).                |
| `infrastructure/nginx/` | Reverse Proxy & Gateway | Nginx configuration for routing, SSL termination.          |
| `docker-compose.*.yml`  | Orchestration           | Docker files for local, test, and production environments. |
| `.env.example`          | Configuration           | Environment variable templates for the Docker stack.       |

## Quick start (Local setup)

1.  **Dependencies:** Ensure you have **Docker**, **Docker Compose** and **Node.js 24+** installed.
1.  **Configuration:** Copy the example and set environment variables: `cp .env.example .env.local`.
1.  **Run:** Start the entire stack: `npm run start:local`.
1.  **Access:** End-user interface: `http://localhost/` (default) | Admin Panel: `http://localhost/admin` (default).

## Advanced start (Production setup)

1.  **Dependencies:** Ensure you have **Docker**, **Docker Compose** and **Node.js 24+** installed.
1.  **Configuration:**
    1.  Copy the example and set environment variables: `cp .env.example .env`.
    1.  Put SSL certificate files in `infrastructure/nginx/ssl/`.
    1.  Adjust the data in the `.env` file to your environment.
1.  **Build:** Start the entire stack: `npm run build:prod`.
1.  **Placing:** Transfer **application image**, **`.env` file**, **docker-compose.yml** and **docker-compose.prod.yml** to server with installed **Docker** and **Docker Compose**. All files except **image** put in the same folder.
1.  **Run:** Move to folder with app files and start app: `docker compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml up -d`.
1.  **Access:** End-user interface: `https://[your-domain]/` | Admin Panel: `https://[your-domain]/admin`.

## Copyright and licensing notice

**© 2025 Ihcaer. All rights reserved. (UNLICENSED)**

**Licensing terms:**

1.  **This code is NOT released under any Open Source license.** It is explicitly marked as UNLICENSED.
1.  Any copying, modification, redistribution, or utilization of this code or documentation for commercial or private purposes is **strictly prohibited** without the express written consent of the Copyright Holder.
1.  This repository is made publicly visible **for review and informational purposes only.**
