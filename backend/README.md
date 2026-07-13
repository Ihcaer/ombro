# @ombro/api

> **Skema API** > Part of the **Skema** tech ecosystem.

This repository contains the core business logic and API services for the application, built using **NestJS** and **Prisma** for database interaction.

## 1. Quick start (Standalone Mode)

If you need to run the **Backend API outside of Docker** for fast debugging or IDE integration, follow this guide. For the full stack setup, refer to the [**Main README**](../README.md).

### 1.1 Prerequisites

1.  Node.js (v24+)
2.  npm or yarn
3.  A running PostgreSQL database instance (accessible locally or via the Docker `db` service).

### 1.2 Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Environment file:** Create a local environment file. This file contains the necessary database connection string and secrets.
    ```bash
    cp .env.example .env.local
    # Edit .env.local with your local database connection details
    ```
3.  **Database connection:** Ensure your `POSTGRES_URL` in `.env.local` points to an accessible database. Example: `postgresql://user:password@localhost:5432/yourdb`

### 1.3 Running the application

- **Development mode (Watch):** Starts the application and automatically reloads on file changes.
  ```bash
  npm run start:dev
  ```
- **Production build (Run):** Compiles the application and runs the optimized JavaScript code.
  ```bash
  npm run build
  npm run start:prod
  ```

## 2. Database and Prisma management

We use **Prisma** as our ORM. All schema changes and migrations are managed via the Prisma CLI.

### 2.1. Schema changes

To modify the database structure (add a table, change a column):

1.  Edit the schema file: **`prisma/schema.prisma`**
2.  Generate a new migration file:
    ```bash
    npm run prisma:migrate:dev
    ```

### 2.2. Client generation

After any change to `schema.prisma`, you must regenerate the Prisma Client:

```bash
npm run prisma:generate
```

### 2.3. Seeding

Database population and state initialization are handled via the CLI seed command group. It interacts directly with the database layer using Prisma.

#### 2.3.1. Usage examples

Here is how to run the user seeding command using both development and production execution methods:

##### 1. Interactive mode (guided)

If you run the command without any arguments, the CLI will dynamically prompt you for the missing credentials in the terminal.

- **Development:** `npm run prisma:seed:admin:dev`
- **Production:** `node dist/cli.js seed user`

_Terminal interaction:_

```markdown
? Enter first admin's (user) email address: admin@example.com
? Enter first admin's (user) password: _[input is hidden]_
```

##### 2. Non-interactive mode (automated / CI)

You can completely bypass terminal prompts by passing inline flags.

- **Development:** `npm run prisma:seed:admin:dev -- -e admin@example.com -p SecurePassword123`
- **Production:** `node dist/cli.js seed user -e admin@example.com -p SecurePassword123`

#### 2.3.2. Data integrity & error handling

To ensure deterministic state control, the seeding process implements strict database constraints:

- **Intentional creation (Prisma.create):** The tool is designed to prevent silent overwrites. It attempts a strict insert rather than an upsert.
- **Conflict resolution (P2002):** If you attempt to seed a user with an email that already exists, the script catches the Prisma unique constraint failure and terminates gracefully with a clean terminal error instead of dumping a stack trace:

```plaintext
An admin (user) with this email address already exists.
```

- **Input fallbacks:** If an invalid email layout is passed via flags, the internal validator resets the field to undefined, triggering the interactive CLI prompt so you can fix the input manually.

## 3. Command Line Interface (CLI)

The application features a dedicated CLI built with `nest-commander` to handle administrative scripts and asynchronous tasks outside the HTTP server context.

### 3.1. Execution

You can run the CLI either directly from the TypeScript source files (recommended for development) or from the compiled JavaScript files (recommended for production).

#### Option A: Development mode (without building)

To run the CLI directly from TypeScript source code without compiling it first, use `ts-node`:

```shell
npm run cli -- [command] [sub-command] [options]
```

#### Option B: Production mode (after building)

First, compile the application into JavaScript:

```shell
npm run build
```

Then, execute the compiled entry point using Node.js:

```shell
node dist/cli.js [command] [sub-command] [options]
```

### 3.2. Command reference

Below is the list of available CLI commands and their structures:

| Command | Sub-command | Flags/Options                                          | Description                                                                                                                                                   |
| :------ | :---------- | :----------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `seed`  | _None_      | _None_                                                 | Root seeding command. Displays available sub-commands.                                                                                                        |
| `seed`  | `admin`     | `-e, --email <email>` <br> `-p, --password <password>` | Seeds a specific admin (user) into the database. Triggers interactive mode if flags are missing. Only works when there are no admins (users) in the database. |

## 4. Architecture overview

### 4.1. NestJS structure

This project follows the modular architecture enforced by NestJS:

- **Modules:** Each major domain (e.g. Auth, Team) is in its own module (`src/module-name`).
- **Services:** Contain the core business logic and handle prisma queries.
- **Controllers:** Handle incoming HTTP requests and delegate tasks to the appropriate service.

### 4.2. Authentication and authorization

- **Authentication:** Handled by the `Auth` module using JWTs (JSON Web Tokens). Tokens are validated using **Guards**.
- **Authorization:** Role-based permissions are enforced using custom **Decorators** and **Guards**.

## 5. Testing

We utilize **Jest** for all unit and integration testing.

### 5.1. Running tests

- **Unit/Integration tests:** Runs all tests found in files ending with `.spec.ts`.
- **Watch mode (Development):**

```bash
npm run test:watch
```

- **Test coverage:** Generates an HTML report showing test coverage statistics.

```bash
npm run test:cov
```

---

## Copyright and Licensing Notice

**© 2025 Ihcaer. All Rights Reserved. (UNLICENSED)**

**Licensing Terms:**

1.  **This code is NOT released under any Open Source license.** It is explicitly marked as UNLICENSED.
2.  Any copying, modification, redistribution, or utilization of this code or documentation for commercial or private purposes is **strictly prohibited** without the express written consent of the Copyright Holder.
3.  This repository is made publicly visible **for review and informational purposes only.**
