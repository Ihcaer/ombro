import { Directive, model, ModelSignal } from '@angular/core';
import { BaseFormControl } from './base-form-control';
import { FormCheckboxControl } from '@angular/forms/signals';

@Directive()
export abstract class BaseToggleControl
  extends BaseFormControl<boolean>
  implements FormCheckboxControl
{
  checked: ModelSignal<boolean> = model.required();
}
