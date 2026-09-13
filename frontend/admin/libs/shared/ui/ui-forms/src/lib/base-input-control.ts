import { Directive, model, ModelSignal } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { BaseFormControl } from './base-form-control';

@Directive()
export abstract class BaseInputControl<T>
  extends BaseFormControl<T>
  implements FormValueControl<T>
{
  value: ModelSignal<T> = model.required();
}
