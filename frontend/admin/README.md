# @ombro/admin-panel

> **Skema Admin Panel** > Part of the **Skema** tech ecosystem.

This repository hosts the **Admin Panel**, a specialized application built with **Angular** and used exclusively by authorized personnel to manage business data, configuration, and users via the Backend API.

## 1. Quick Start (Local Development)

This guide is for running the Admin Panel locally. For a complete system environment (including Backend, DB, and Proxy), please refer to the [**Main README**](../../README.md).

### 1.1 Prerequisites

1.  Node.js (v24+) and npm
2.  **Angular CLI** and **Nx CLI** (install globally: `npm install -g @angular/cli @nx/cli`)
3.  The **Backend API** must be running and accessible.

### 1.2 Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Environment Configuration:**
    The Admin Panel requires local environment configuration to define the API endpoint it connects to.

    - Create a local environment file based on the template:
      ```bash
      cp src/environments/environment.example.ts src/environments/environment.dev.ts
      ```
    - **Crucial:** Edit `src/environments/environment.dev.ts` to ensure the `API_BASE_URL` is set correctly. When running via Docker Compose, this should point to the public NGINX path:
      ```typescript
      export const environment = {
        production: false,
        API_BASE_URL: 'http://localhost/api/v1',
      };
      ```

### 1.3 Running the Application

- **Development Mode:** Starts the application using the local proxy configuration, usually launching on port 4200.
  ```bash
  npm run serve
  ```
- **Access:** When running the full stack via Docker Compose, access the panel via the Reverse Proxy URL: `http://localhost/admin`

## 2. Architecture and State Management

The application is structured around **Nx Workspaces** and utilizes **NgRx** for predictable state management.

### 2.1. Nx Monorepo Structure

- **Apps (`apps/`):** Contains the Admin Panel application logic (source code, routing, main components).
- **Libs (`libs/`):** Contains reusable code shared across Angular apps or standalone components.

### 2.2. NgRx State Management

All complex application state is managed using the Redux pattern via NgRx:

- **Actions:** Describe unique events that occur.
- **Reducers:** Pure functions that determine how the application's current state transitions to the next state, based on an Action.
- **Effects:** Handle side effects (API calls, asynchronous logic) by dispatching new Actions upon completion.
- **Selectors:** Used to retrieve specific slices of data from the store, providing performance benefits (memoization).

### 2.3. Data Flow

1.  **Component:** Dispatches an **Action** (e.g., `loadImagesRequested`).
2.  **Effect:** Catches the Action, calls the API service (`HttpClient`).
3.  **API Service:** Sends the HTTP request (with JWT attached via Interceptor).
4.  **Effect (Success/Failure):** Dispatches a new Action (e.g., `loadImagesSuccess`).
5.  **Reducer:** Updates the feature state in the **NgRx Store**.
6.  **Component:** Subscribes to the data using a **Selector**.

## 3. Testing

We utilize industry-standard tools integrated via Nx.

### 3.1. Unit Testing (Vitest)

We use **Vitest** for fast and efficient unit testing of Services, Reducers, Effects, and utility functions.

- **Run all tests:**
  ```bash
  npm run test
  ```
- **Watch Mode:**
  ```bash
  npm run test:watch
  ```

### 3.2. End-to-End (E2E) Testing (Playwright)

**Playwright** is used for robust, browser-level testing of the user workflow.

- **Run E2E tests:**
  ```bash
  npm run test:e2e
  ```

➡️ **For detailed API specifications (endpoints, request/response structure), refer to the [API Reference](../../docs/3-API-REFERENCE/index.md) in the main documentation.**

## Copyright and Licensing Notice

**© 2025 Ihcaer. All Rights Reserved. (UNLICENSED)**

**Licensing Terms:**

1.  **This code is NOT released under any Open Source license.** It is explicitly marked as UNLICENSED.
2.  Any copying, modification, redistribution, or utilization of this code or documentation for commercial or private purposes is **strictly prohibited** without the express written consent of the Copyright Holder.
3.  This repository is made publicly visible **for review and informational purposes only.**
