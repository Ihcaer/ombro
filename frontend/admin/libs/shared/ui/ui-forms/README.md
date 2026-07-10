# ui-forms

A collection of standardized form components for our Nx monorepo. This library wraps PrimeNG components to provide a unified API, consistent styling, and automated accessibility features.

## Key features

- **PrimeNG wrappers:** Familiar API with internal design system defaults.
- **Automated ID generation:** Integrates with our internal [`@ombro/util-id`](../util-id/README.md) to ensure unique, collision-free id and for attributes.
- **Accessibility ready:** Automated linking between labels and inputs.

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

## Usage

### Basic example

All components are compatible with ReactiveFormsModule. You don't need to manually provide IDs; the library generates them automatically.

```html
<ombro-input-text formControlName="username" />
```

or

```html
<ombro-input-text
  formControlName="username"
  type="text"
  autocomplete="username"
  label="Username"
  placeholder="Enter your name"
/>
```

## Development & integration

### Prerequisites

This library requires PrimeNG and our internal ID generator library:

```
primeng
@ombro/shared/util-ui
```

### Running tests

```
nx test ui-forms
```

## Guidelines

1. **Direct PrimeNG Usage:** Avoid using raw PrimeNG components (e.g., p-dropdown) directly in feature apps. Always use the lib- equivalent to ensure the ID generator and global form styles are applied.

1. **Labels:** Do not use lib-label standalone unless building a custom complex form field. It is automatically bundled into the other form components.

1. **Validation:** Components are styled to automatically show error states when the attached FormControl is invalid and touched.
