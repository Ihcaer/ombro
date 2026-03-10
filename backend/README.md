# @ombro/api

> **Skema API** > Part of the **Skema** tech ecosystem.

This repository contains the core business logic and API services for the application, built using **NestJS** and **Prisma** for database interaction.

## 1. Quick Start (Standalone Mode)

If you need to run the **Backend API outside of Docker** for fast debugging or IDE integration, follow this guide. For the full stack setup, refer to the [**Main README**](../README.md).

### 1.1 Prerequisites

1.  Node.js (v24+)
2.  npm or yarn
3.  A running PostgreSQL database instance (accessible locally or via the Docker `db` service).

### 1.2 Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
2.  **Environment File:** Create a local environment file. This file contains the necessary database connection string and secrets.
    ```bash
    cp .env.example .env.local
    # Edit .env.local with your local database connection details
    ```
3.  **Database Connection:** Ensure your `POSTGRES_URL` in `.env.local` points to an accessible database. Example: `postgresql://user:password@localhost:5432/yourdb`

### 1.3 Running the Application

- **Development Mode (Watch):** Starts the application and automatically reloads on file changes.
  ```bash
  npm run start:dev
  ```
- **Production Build (Run):** Compiles the application and runs the optimized JavaScript code.
  ```bash
  npm run build
  npm run start:prod
  ```

## 2. Database and Prisma Management

We use **Prisma** as our ORM. All schema changes and migrations are managed via the Prisma CLI.

### 2.1. Schema Changes

To modify the database structure (add a table, change a column):

1.  Edit the schema file: **`prisma/schema.prisma`**
2.  Generate a new migration file:
    ```bash
    npm run prisma:migrate:dev
    ```

### 2.2. Client Generation

After any change to `schema.prisma`, you must regenerate the Prisma Client:

```bash
npm run prisma:generate
```

## 3. Architecture Overview

### 3.1. NestJS Structure

This project follows the modular architecture enforced by NestJS:

- **Modules:** Each major domain (e.g. Auth, Team) is in its own module (`src/module-name`).
- **Services:** Contain the core business logic and handle prisma queries.
- **Controllers:** Handle incoming HTTP requests and delegate tasks to the appropriate service.

### 3.2. Authentication and Authorization

- **Authentication:** Handled by the `Auth` module using JWTs (JSON Web Tokens). Tokens are validated using **Guards**.
- **Authorization:** Role-based permissions are enforced using custom **Decorators** and **Guards**.

## 4. Testing

We utilize **Jest** for all unit and integration testing.

### 4.1. Running Tests

- **Unit/Integration Tests:** Runs all tests found in files ending with `.spec.ts`.
- **Watch Mode (Development):**

```bash
npm run test:watch
```

- **Test Coverage:** Generates an HTML report showing test coverage statistics.

```bash
npm run test:cov
```

---

➡️ **For full API usage, including endpoint paths, request bodies, and responses, please refer to the [API Reference](../docs/3-API-REFERENCE/index.md)**

## Copyright and Licensing Notice

**© 2025 Ihcaer. All Rights Reserved. (UNLICENSED)**

**Licensing Terms:**

1.  **This code is NOT released under any Open Source license.** It is explicitly marked as UNLICENSED.
2.  Any copying, modification, redistribution, or utilization of this code or documentation for commercial or private purposes is **strictly prohibited** without the express written consent of the Copyright Holder.
3.  This repository is made publicly visible **for review and informational purposes only.**
