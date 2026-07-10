# util-id

A lightweight utility library for generating consistent, unique, and collision-resistant identifiers across our Nx workspace. This is the standard tool for linking labels to form controls and managing ARIA attributes.

## Why use this?

- **Consistency:** Ensures a unified format for IDs across all applications (e.g. app-prefix-1).

- **SSR Friendly:** Designed to avoid hydration mismatches by using stable generation logic.

- **Collision Avoidance:** Prevents duplicate IDs even when multiple instances of a component are rendered on the same page.

## Installation

This utility is typically consumed by other UI libraries, but can be used directly in feature apps:

```typescript
import { IdGeneratorService } from '@ombro/shared/util-ui';
```

## Usage

```typescript
@Component({...})
export class MyComponent {
  private readonly idGeneratorService = inject(IdGeneratorService);

  // Generates something like: "input-1", "input-2", etc.
  protected readonly componentId: string = this.idGeneratorService.generate('input');
}
```

## API reference

### `IdGeneratorService`

| Method     | Parameters       | Returns  | Description                                    |
| :--------- | :--------------- | :------- | :--------------------------------------------- |
| `generate` | `prefix: string` | `string` | Appends an incremental counter to your prefix. |

## Testing

```
nx test util-id
```
