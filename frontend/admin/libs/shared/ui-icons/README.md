# ui-icons

This library provides a centralized collection of shared ui-icons for use across our applications and other libraries within the Nx workspace. By centralizing the icon assets, we ensure consistency and streamline updates.

## Installation

To make the ui-icons available in an application, you might need to import the provider in appConfig:

```typescript
import { ApplicationConfig } from '@angular/core';
// ...
import { provideMaterialSymbols } from '@ui/ui-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other imports
    provideMaterialSymbols(),
  ],
};
```

## Usage

Icons are provided as component. Here's how you can use a specific icon in minimal effort:

```html
<ui-ui-icons name="close"></ui-ui-icons>
```

### Available ui-icons

You can find the full list of available ui-icons [**here**](ICONS.md).

### Customization

Icons in this library accept the following standardized input properties to control their appearance:

| Property name | Type    | Required | Description                           |
| :------------ | :------ | :------- | :------------------------------------ |
| `[name]`      | string  | Yes      | Chooses icon.                         |
| `[size]`      | number  | No       | Controls with and height of the icon. |
| `[weight]`    | number  | No       | Sets icon weight                      |
| `[fill]`      | boolean | No       | If `true` icon will be filled.        |
| `[grade]`     | number  | No       | Sets icon grade.                      |

**Important:** Input properties other than `[name]` and `[size]` are not capable of SVG ui-icons.

### Examples

```html
<ui-ui-icons name="close"></ui-ui-icons>
<ui-ui-icons name="close" [size]="20"></ui-ui-icons>
<ui-ui-icons name="settings" [size]="20" [weight]="600" [fill]="true" [grade]="0"></ui-ui-icons>
```

## Customization settings

Available customization can be changed in [**ui-icons.properties.ts**](./src/lib/ui-icons/ui-icons.properties.ts).

## Contributing

If you need to add a new icon, you can do it in two ways:

### A. Material Symbols

1. Add **Icon name** to _MATERIAL_ICONS_ table in [**ui-icons.list.ts**](./src/lib/ui-icons/ui-icons.list.ts).
1. Update the _Material Symbols_ table in [**ICONS.md**](ICONS.md).

### B. Custom icon (SVG)

1. Place **SVG file** in a `src/assets/ui-icons` folder.
1. Add **Icon name** (without .svg extension) to _CUSTOM_ICONS_ table in [**ui-icons.list.ts**](./src/lib/ui-icons/ui-icons.list.ts).
1. Update the _Custom Icons_ table in [**ICONS.md**](ICONS.md).
