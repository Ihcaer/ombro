# ui-forms

A collection of standardized form components for our Nx monorepo. This library wraps PrimeNG components to provide a unified API, consistent styling, and automated accessibility features.

## Key features

- **PrimeNG wrappers:** Familiar API with internal design system defaults.
- **Automated ID generation:** Integrates with our internal [`@ombro/util-id`](../util-id/README.md) to ensure unique, collision-free id and for attributes.
- **Accessibility ready:** Automated linking between labels and inputs.
- **Translation**: Errors and labels are translated.

## Components included

| Component             | Primeng equivalent     | Description                                                                                                    |
| :-------------------- | :--------------------- | :------------------------------------------------------------------------------------------------------------- |
| `ombro-checkbox`      | `p-checkbox`           | Single or multiple choice selection.                                                                           |
| `ombro-datepicker`    | `p-datepicker`         | Date and time picker with localized defaults.                                                                  |
| `ombro-input-text`    | `input` & `p-password` | Standard text input and password field.                                                                        |
| `ombro-multi-select`  | `p-multiselect`        | Dropdown allowing multiple selections.                                                                         |
| `ombro-select`        | `p-select`             | Standard single-selection dropdown.                                                                            |
| `ombro-toggle-switch` | `p-toggleswitch`       | Binary toggle switch.                                                                                          |
| `ombro-input-label`   | Custom                 | **Internal only.** Used by the components above to ensure consistent typography and required-field indicators. |
| `error-message`       | Custom                 | **Internal only.** Used by the component above to ensure consistent errors.                                    |

## Usage

### Basic example

All components are compatible with _Signal Forms_. You don't need to manually provide IDs; the library generates them automatically.

```html
<ombro-input-text [formField]="form.username" />
```

or

```html
<ombro-input-text
  [formField]="form.username"
  type="text"
  autocomplete="username"
  [label]="'label.username' | transloco"
  placeholder="Enter your name"
/>
```

It's possible to pass label without translation simply by: `label="Username"`.

```ts
model = signal({
  username: '',
});

form = form(this.model, (schemaPath) => {
  required(schemaPath.username, {
    message: translationMessage('forms.errors.required'),
  });
});
```

> **Note:** Translation keys above are examples.

## Development & integration

### Prerequisites

This library requires:

1. PrimeNG
1. Transloco (to handle translations)
1. Internal ID generator library: [id-lib](../../utils/util-id/README.md)
1. Internal translation library: [translation-utils](../../utils/translation-utils/README.md)

### Running tests

```
nx test ui-forms
```

## Guidelines

1. **Direct PrimeNG usage:** Avoid using raw PrimeNG components (e.g. p-dropdown) directly in feature apps. Always use the lib- equivalent to ensure the ID generator and global form styles are applied.
1. **Labels:** Do not use lib-label standalone unless building a custom complex form field. It is automatically bundled into the other form components.
1. **Validation:** Components are styled to automatically show error states when they are used in signal forms and it is invalid and touched.
1. **Without translations:** It's possible to use this lib without using the translations simply by passing raw string values that are not translation keys.
