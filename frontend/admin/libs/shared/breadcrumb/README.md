# Breadcrumb

This library provides a streamlined, automated breadcrumb solution for our Nx workspace. It acts as a high-level wrapper around our Primeng Breadcrumb component, eliminating the need for manual path configuration by automatically detecting the current route.

## Features

- **Zero Configuration:** Automatically parses the active route to generate labels.
- **Consistent Styling:** Ensures all applications follow the internal design system.

## Installation

Since this is an internal library within our Nx monorepo, you can simply import it into your application's module or component:

```typescript
import { BreadcrumbComponent } from '@ombro/shared/breadcrumb';
```

## Configuration

For the breadcrumb to display labels correctly, you must define a breadcrumb property within the data object of your routes.

### 1. Define routes

```typescript
export const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    data: { breadcrumb: 'Settings' },
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        data: { breadcrumb: 'User profile' },
      },
    ],
  },
];
```

### 2. Add component to template

The library handles the rest. Just place the selector in your layout:

```html
<ombro-breadcrumb />
```

## Usage details

### Dynamic labels

If a route segment represents a dynamic ID (e.g. :id), the library will check for the breadcrumb value in the route data.

### Inputs

| Input           | Type     | Default | Description                            |
| :-------------- | :------- | :------ | :------------------------------------- |
| `homeUrl`       | `string` | `'/'`   | Defines home url.                      |
| `separatorItem` | `string` | `/`     | The visual character between segments. |

## Testing

```
nx test breadcrumb
```
