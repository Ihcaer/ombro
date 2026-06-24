# ui-primitives

A shared library containing low-level, atomic, and purely presentational UI components (primitives) used across the **Ombro** ecosystem. Components in this library are highly reusable, framework-standard compliant, and completely decoupled from any business logic.

## Components included

### Avatar

Used to display user profile pictures or initials with built-in fallback mechanisms.

#### Basic usage

```ts
import { AvatarComponent } from '@ombro/shared/ui-primitives';

@Component({
  imports: [AvatarComponent],
  // other component properties
})
```

```html
<ombro-primitive-avatar imageUrl="your-link" name="name value" size="1.5rem" />
```

- `size` can take value with and without unit. When value don't have unit, component will use _px_. It should be **string** always.

## Adding new components

To add new component follow the steps bellow:

1. Run component generator command

```shell
npx nx g @nx/angular:component libs/shared/ui-primitives/src/lib/[component_name]/[component_name] --type=component --changeDetection=OnPush --style=scss
```

- `[component_name]` value should be changed to new component name.
- `--style` flag can take following values: `scss`, `css`, `none`.

2. Export the component in the main [`index.ts`](./src/index.ts).
3. Update this `README.md` file under the **Components included** section.

## Running unit tests

Run `nx test ui-primitives` to execute the unit tests.
