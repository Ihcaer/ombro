# Breadcrumb

This library provides a streamlined, automated breadcrumb solution for our Nx workspace. It acts as a high-level wrapper around our Primeng Breadcrumb component, eliminating the need for manual path configuration by automatically detecting the current route.

## Features

- **Zero Configuration:** Automatically parses the active route to generate labels.
- **Consistent Styling:** Ensures all applications follow the internal design system.
- **Internalization (i18n):** Labels are translated (handled by app).

## Installation

Since this is an internal library within our Nx monorepo, you can simply import it into your application's module or component:

```typescript
import { BreadcrumbComponent } from '@ombro/shared/breadcrumb';
```

## Configuration

For the breadcrumb to display labels correctly, you must define a breadcrumb property within the data object of your routes.

### 1. Define routes

#### Sample configuration:

```typescript
export const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    data: { breadcrumbLabel: 'Settings' },
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        data: { breadcrumbLabel: 'User profile' },
      },
    ],
  },
];
```

Label can be static value or translated text:

##### Static

```typescript
breadcrumbLabel: 'Settings';
```

OR

##### Translated

```typescript
breadcrumbLabel: 'panel.pages.dashboard';
```

Translation is managed by application. To see possible translation keys and how to use them, go to app `README.md` file.

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
