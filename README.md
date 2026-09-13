[![Netlify Status](https://api.netlify.com/api/v1/badges/a494a725-6339-4745-8edd-ec025ac0ef52/deploy-status)](https://app.netlify.com/projects/demo-ombro/deploys)
![Live Demo](https://img.shields.io/badge/live_preview-test?style=flat&logo=netlify&label=demo&color=00C7B7&link=https%3A%2F%2Fdemo-ombro.netlify.app)

# Skema (Project Ombro)

This repository contains the complete source code for the Skema application, including two frontend services, the core API, and all configuration files, all managed under a unified monorepo structure.

## Frontend live demo

A demo version of the frontend layer is available at the following address:

**[Run live demo](https://demo-ombro.netlify.app)**

> **Technical note:** The live version runs in **Preview/Demo** mode. All HTTP requests to the backend have been mocked (using interceptor). This allows for full testing of the interface and application states without having to launch the database.

### Demo account details

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
1.  **Build:** Build container images by running the command: `build:local`
1.  **Run:** Start the entire stack: `npm run start:local`.
1.  **Access:** End-user interface: `http://localhost/` (default) | Admin Panel: `http://localhost/admin` (default).

## Advanced start (Production setup)

1.  **Dependencies:** Ensure you have **Docker**, **Docker Compose** and **Node.js 24+** installed.
1.  **Configuration:**
    1.  Copy the example and set environment variables: `cp .env.example .env`.
    1.  Put SSL certificate files in `infrastructure/nginx/ssl/`.
    1.  Adjust the data in the `.env` file to your environment.
1.  **Build:** Build the entire stack: `npm run build:prod`.
1.  **Placing:** Transfer **application image**, **`.env` file**, **docker-compose.yml** and **docker-compose.prod.yml** to server with installed **Docker** and **Docker Compose**. All files except **image** put in the same folder.
1.  **Run:** Move to folder with app files and start app: `docker compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml up -d`.
1.  **Access:** End-user interface: `https://[your-domain]/` | Admin Panel: `https://[your-domain]/admin`.

## Testing

The project includes unit, integration and e2e tests. Follow instructions below to run the tests. All tests requires _Node.js_.

### Unit tests

You can run both frontend and backend test at once or separately.

#### Both frontend and backend

1. Install dependencies:

```shell
npm run install
```

2. Run the tests:

```shell
npm run test
```

---

#### Individually

##### Frontend

1. Install dependencies:

```shell
npm run install:frontend:admin
```

2. Run the tests:

```shell
npm run test:frontend:admin
```

##### Backend

1. Install dependencies:

```shell
npm run install:backend
```

2. Run the tests:

```shell
npm run test:backend
```

---

### Integration tests

Tests include the backend and other services such as database or S3. This tests also requires _Docker_.

1. Install dependencies:

```shell
npm run install:backend
```

2. Run the tests:

```shell
npm run test:backend:int
```

---

### E2E tests

This tests requires _Docker_. You can run them in two ways:

#### Local (with UI)

In this way application will start in _docker compose_, but test engine will run locally with ui. Follow those steps:

1. Install frontend dependencies:

```shell
npm run install:frontend:admin
```

2. Go to frontend folder:

```shell
cd frontend/admin
```

3. Install test browsers:

```shell
npx playwright install
```

**Important:** If you need to install system dependencies, use this command: `npx playwright install-deps` additionally.

4. Back to the root folder:

```shell
cd ../..
```

5. Run the tests:

```shell
npm run test:e2e:local:ui:admin
```

This will run app with test settings and open window with tests.

> **Note:** Remember to end testing by closing test window. If you end tests in console, containers will still be running (in such a situation use `npm run posttest:e2e:local:ui:admin` command).

#### Compose

In this way test engine is running directly in compose so you don't need to install anything (except _Docker_).

To start the test just run this command:

```shell
npm run test:e2e:admin
```

> **Note:** If the tests will fail, you will need to use `npm run posttest:e2e:admin` command to close containers.

## Copyright and licensing notice

**© 2025 Ihcaer. All rights reserved. (UNLICENSED)**

**Licensing terms:**

1.  **This code is NOT released under any Open Source license.** It is explicitly marked as UNLICENSED.
1.  Any copying, modification, redistribution, or utilization of this code or documentation for commercial or private purposes is **strictly prohibited** without the express written consent of the Copyright Holder.
1.  This repository is made publicly visible **for review and informational purposes only.**
