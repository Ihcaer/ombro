import { computed, Directive, inject, input, InputSignal, output } from '@angular/core';
import {
  DisabledReason,
  FormUiControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';
import { IdGeneratorService } from '@ombro/shared/utils/util-id';

@Directive()
export abstract class BaseFormControl<T> implements FormUiControl<T> {
  protected idGenerationService = inject(IdGeneratorService);

  protected readonly inputId = this.idGenerationService.generate(this.constructor.name);

  disabled: InputSignal<boolean> = input(false);
  readonly: InputSignal<boolean> = input(false);
  hidden: InputSignal<boolean> = input(false);

  invalid: InputSignal<boolean> = input(false);
  pending: InputSignal<boolean> = input(false);

  touched: InputSignal<boolean> = input(false);
  dirty: InputSignal<boolean> = input(false);

  required: InputSignal<boolean> = input(false);

  errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);

  name: InputSignal<string> = input('');

  min: InputSignal<NonNullable<T> | undefined> = input();
  max: InputSignal<NonNullable<T> | undefined> = input();

  minLength: InputSignal<number | undefined> = input();
  maxLength: InputSignal<number | undefined> = input();

  pattern = input<readonly RegExp[]>([]);

  touch = output<void>();

  hasError = computed<boolean>(
    () => this.invalid() && (this.dirty() || this.touched()) && this.errors().length > 0,
  );

  errorState = computed<string | null>(() => {
    if (!this.hasError()) return null;

    return this.errors()[0].message ?? 'A field error occurred';
  });
}
