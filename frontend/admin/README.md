# @ombro/admin-panel

> **Skema Admin Panel** > Part of the **Skema** tech ecosystem.

This repository hosts the **Admin Panel**, a specialized application built with **Angular** and used exclusively by authorized personnel to manage business data, configuration, and users via the Backend API.

## 1. Quick start (Local development)

This guide is for running the Admin Panel locally. For a complete system environment (including Backend, DB, and Proxy), please refer to the [**Main README**](../../README.md).

### 1.1 Prerequisites

1.  Node.js (v24+) and npm
2.  **Angular CLI** and **Nx CLI** (install globally: `npm install -g @angular/cli @nx/cli`)
3.  The **Backend API** must be running and accessible.

### 1.2 Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Environment configuration:**
    The Admin Panel requires local environment configuration to define the API endpoint it connects to.
    - Create a local environment file based on the template:
      ```bash
      cp src/environments/environment.example.ts src/environments/environment.dev.ts
      ```
    - **Crucial:** Edit `src/environments/environment.dev.ts` to ensure the `API_BASE_URL` is set correctly. When running via Docker Compose, this should point to the public NGINX path:
      ```typescript
      export const environment = {
        production: false,
        apiDomain: '',
        apiSlug: '/api/v1',
      };
      ```

### 1.3 Running the application

- **Development mode:** Starts the application using the local proxy configuration, usually launching on port 4200.
  ```bash
  npm run serve
  ```
- **Access:** When running the full stack via Docker Compose, access the panel via the Reverse Proxy URL: `http://localhost/admin`

## 2. Architecture and state management

The application is structured around **Nx Workspaces** and utilizes **NgRx** for reactive, signal-based state management.

### 2.1. Nx monorepo structure

- **Apps (`apps/`):** Contains the Admin Panel application logic (source code, routing, main components).
- **Libs (`libs/`):** Contains reusable code shared across Angular apps.

### 2.2. NgRx SignalStore management

Application state is managed using the modern, functional NgRx SignalStore, leveraging Angular Signals for fine-grained reactivity. Instead of the traditional Redux pattern (Actions/Reducers), state and logic are encapsulated within unified stores composed of:

- **State (`withState`):** Defines the strongly-typed initial state. Every state property automatically becomes a reactive Angular Signal.
- **Computed signals (`withComputed`):** Derived state derived from existing signals (equivalent to traditional Selectors), offering automatic memoization and optimal performance.
- **Methods (`withMethods`):** Functions responsible for mutating the state (replacing Reducers) and handling asynchronous side effects like API calls (replacing Effects).

### 2.3. Data flow

1.  **Component:** Calls a method directly on the injected SignalStore instance (e.g. `store.loadImages()`).
2.  **Store method:** Handles the asynchronous logic, triggering the API service (`HttpClient`).
3.  **API service:** Sends the HTTP request.
4.  **Store method (Success/Failure):** Updates the state directly using the patch state utility (`patchState(store, ...)`).
5.  **Component:** Automatically reacts to the state changes by reading the store's signals or computed signals directly in the template.

## 3. Internalization (i18n)

The application uses **Transloco** to support multilingualism. The default and fallback application language is **English (`en`)**.

### 3.1 Supported languages

| Code | Language | Status               |
| :--- | :------- | :------------------- |
| `en` | English  | 100% (Base language) |
| `pl` | Polish   | 100%                 |

### 3.2 File structure

All translation files are located in the `src/assets/i18n/` directory:

```text
src/assets/i18n/
├── auth/
│   ├── en.json
│   └── pl.json
├── panel/
│   ├── en.json
│   ├── pl.json
│   └── other folders (scopes)...
├── en.json
└── pl.json
```

### 3.3 How do I add a new language?

1. **Create a files:** Copy currently existing translation files and name them language code according to the ISO 639-1 standard (e.g. `en` for English).
1. **Translate values:** Replace text values, keeping keys and variables in parentheses intact (e.g. `{{count}}`).
1. **Register Language:** Add a new language code (and name if needed) to the supported list in the following files:
   - [`transloco.config.ts`](./transloco.config.ts)
   - [`i18n.config.ts`](./apps/admin-panel/src/app/core/config/i18n/i18n.config.ts)

## 4. Testing

We utilize industry-standard tools integrated via Nx.

### 4.1. Unit testing (Vitest)

We use **Vitest** for fast and efficient unit testing of Services, Reducers, Effects, and utility functions.

- **Run all tests:**
  ```bash
  npm run test
  ```
- **Watch Mode:**
  ```bash
  npm run test:watch
  ```

### 4.2. End-to-End (E2E) Testing (Playwright)

**Playwright** is used for robust, browser-level testing of the user workflow.

Tests can be run in standard console way and UI mode.

> **Note:** E2E tests verify actual data flow. Before running them, make sure your local backend is running and has access to the test database.

#### Console

1. Install dependencies:

```shell
npm install
```

2. Run the tests:

```shell
npm run test:e2e
```

---

#### UI mode

1. Install dependencies:

```shell
npm install
```

2. Run the tests:

```shell
npm run test:e2e:local:ui
```

## Copyright and Licensing Notice

**© 2025 Ihcaer. All Rights Reserved. (UNLICENSED)**

**Licensing Terms:**

1.  **This code is NOT released under any Open Source license.** It is explicitly marked as UNLICENSED.
2.  Any copying, modification, redistribution, or utilization of this code or documentation for commercial or private purposes is **strictly prohibited** without the express written consent of the Copyright Holder.
3.  This repository is made publicly visible **for review and informational purposes only.**
