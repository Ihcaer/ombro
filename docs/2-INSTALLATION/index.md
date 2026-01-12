# 2. Installation & Setup Prerequisites

The entire application stack is orchestrated via Docker Compose, with configuration files located in the root of this monorepo.

## 2.1 Prerequisites

Before you begin the installation process, ensure your local environment meets the following requirements:

1. **Git:** Required for cloning all repositories.
2. **Docker & Docker Compose:** Required to build and run the services defined in the `docker-compose.yml` file.
3. **Node.js 24+:** (Optional, but recommended). Allows to use scripts and testing the app.
4. **IDE/Text Editor:** (Optional, but recommended) e.g. VS Code.

## 2.2 Environment Setup

Environment configuration is centralized in the monorepo root.

1. **Locate Example File:** The template for shared variables is located at the root: `../.env.example`
2. **Create .env:** Copy the example file and rename it for local development:
   ```bash
   cp ../.env.example ../.env.local
   ```
3. **Configure:** Edit the `../.env.local` file, ensuring credentials (DB user/pass) and shared secrets (JWT) are defined.

## 2.3 Starting the Application

1.  **Build and Run:** From the **monorepo root**, execute the local Docker Compose file:
    ```bash
    docker compose -f docker-compose.yml -f docker-compose.local.yml up --build -d
    ```
