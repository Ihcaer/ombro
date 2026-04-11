# Themes library setup guide

This library contains the design system primitives, PrimeNG presets, and Tailwind 4 configuration bridge. Follow these steps to integrate the theme into your Angular application.

## 1. PrimeNG Configuration

In your application's `app.config.ts`, provide the PrimeNG configuration and import the custom preset from this library. Ensure `cssLayer` is configured to prevent style conflicts with Tailwind.

```typescript
import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import { DefaultTheme } from '@ombro/themes';

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      theme: {
        preset: DefaultTheme,
        options: {
          darkModeSelector: '.dark-mode', // Optional
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
  ],
};
```

## 2. Global Styles Integration

Update your application's main style file (e.g. styles.scss).

Instead of importing tailwindcss directly, import the theme bridge from this library. This file includes the @theme definitions that map PrimeNG primitives to Tailwind classes.

```scss
@use 'libs/themes/src/styles/lib/themes/default/styles/default-theme.scss';
```
