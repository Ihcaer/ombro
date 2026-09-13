# api-client

This library contains the generated API client services, HTTP interceptors, and Data Transfer Objects (DTOs) generated from the OpenAPI specification using **Orval**.

> **Note:** Do not edit generated files directly. All files inside `src/lib/generated` are automatically generated and will be overwritten during code generation.

## 🚀 Code generation

The API client is generated using [Orval](https://orval.dev/) based on the NestJS OpenAPI JSON specification.

### Prerequisites

Make sure that the target Swagger JSON file is generated.

### Commands

To regenerate the API client, run the following Nx target from the root directory:

```shell
npx nx run api-client:generate
```

Or via the global shortcut if configured in root `package.json`:

```shell
npm run generate-api
```

## Usage example

### 1. Register providers

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    // ...
  ],
};
```

### 2. Injecting services in components

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { UsersService, UserDto } from '@my-monorepo/shared/data-access/api';

@Component({
  selector: 'app-user-list',
  template: `
    @for (user of users(); track user.id) {
      <div class="user-card">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
      </div>
    }
  `,
})
export class UserListComponent implements OnInit {
  private readonly usersService = inject(UsersService);

  readonly users = signal<UserDto[]>([]);

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next: (data) => this.users.set(data),
      error: (err) => console.error('Failed to fetch users', err),
    });
  }
}
```

## Configuration

The generation settings are managed in the root Orval configuration file: [`orval.config.ts`](./orval.config.ts).

If endpoints, DTO paths, or HTTP options need to be adjusted, update the corresponding target config in [`orval.config.ts`](./orval.config.ts).
