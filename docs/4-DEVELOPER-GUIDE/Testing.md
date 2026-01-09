# 4.3 Testing Philosophy and Execution

We prioritize automated testing to ensure stability across our modular architecture.

## 4.3.1 Testing Levels

| Level                      | Component Focus                                                                | Purpose                                                                                                    |
| :------------------------- | :----------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| **Unit Tests**             | Individual functions, components, or utilities.                                | Ensure small, isolated units of code work as expected.                                                     |
| **Integration Tests**      | Data flow between system components (e.g., Frontend-to-API, or Backend-to-DB). | Verify that different parts of the system work together.                                                   |
| **End-to-End (E2E) Tests** | Entire user flow (e.g., Admin logs in, adds new admin, adds new post).         | Validate the application from a user's perspective (usually run against the deployed staging environment). |

## 4.3.2 Running Tests Locally

You must run tests within the specific component's repository.

| Service              | Command to Run Tests          | Notes                                                                    |
| :------------------- | :---------------------------- | :----------------------------------------------------------------------- |
| **All services**     | `npm run test:all`            | Starts unit tests in all services.                                       |
| **Frontend (Main)**  | `TBA`                         | Uses `TBA` for unit tests on components.                                 |
| **Frontend (Admin)** | `npm run test:frontend:admin` | Uses `Vitest` for unit tests. Use the watch mode for active development. |
| **Backend**          | `npm run test:backend`        | Uses `Jest` for unit tests.                                              |

## 4.3.3 Coverage Targets

All new features and bug fixes must include corresponding tests. We aim for a minimum of **80% line coverage** for all core business logic in the Backend service.
