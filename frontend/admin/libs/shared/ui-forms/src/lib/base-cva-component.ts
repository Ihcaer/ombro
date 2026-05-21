import { computed, Directive, DoCheck, inject, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
  FORBIDDEN_CHAR_ERROR_KEY,
  MISMATCH_ERROR_KEY,
  WEAK_PASSWORD_ERROR_KEY,
} from './customReactiveValidators';
import { toSignal } from '@angular/core/rxjs-interop';

type OnChangeFn<T> = (value: T) => void;
type OnTouchedFn = () => void;

@Directive()
export abstract class BaseCvaComponent<T> implements ControlValueAccessor, DoCheck {
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });

  protected readonly value = signal<T | null>(null);
  protected readonly isDisabled = signal<boolean>(false);

  private readonly refreshCounter = signal(0);

  private lastTouched = false;
  private lastDirty = false;
  private lastInvalid = false;
  private lastValue: T | null = null;

  constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  ngDoCheck(): void {
    const ctrl = this.control;
    if (!ctrl) return;

    if (
      ctrl.touched !== this.lastTouched ||
      ctrl.dirty !== this.lastDirty ||
      ctrl.invalid !== this.lastInvalid ||
      ctrl.value !== this.lastValue
    ) {
      this.lastTouched = ctrl.touched;
      this.lastDirty = ctrl.dirty;
      this.lastInvalid = ctrl.invalid;
      this.lastValue = ctrl.value;

      this.refreshFormField();
    }
  }

  protected get control() {
    return this.ngControl?.control ?? null;
  }

  protected readonly errorState = computed<string | null>(() => {
    this.refreshCounter();

    const ctrl = this.control;
    if (!ctrl?.invalid || !(ctrl.dirty || ctrl.touched)) return null;

    const errors = ctrl.errors;
    if (!errors) return null;

    const errorMessages: Record<string, string> = {
      required: 'To pole jest wymagane',
      email: 'Niepoprawny format e-mail',
      minlength: `Minimum ${errors['minlength']?.requiredLength} znaki`,
      requiredTrue: 'Pole jest wymagane',
      [MISMATCH_ERROR_KEY]: 'Wprowadzone wartości nie są identyczne',
      [WEAK_PASSWORD_ERROR_KEY]: 'Wprowadzone hasło jest za słabe',
      [FORBIDDEN_CHAR_ERROR_KEY]: `Niedozwolone znaki: ${errors?.[FORBIDDEN_CHAR_ERROR_KEY]?.invalidChars.join(', ')}`,
    };

    const firstError = Object.keys(errors)[0];
    return errorMessages[firstError] || 'Wystąpił błąd';
  });

  protected onChange: OnChangeFn<T> = () => {};
  protected onTouched: OnTouchedFn = () => {};

  writeValue(value: T | null): void {
    this.value.set(value);
  }
  registerOnChange(fn: OnChangeFn<T>): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: OnTouchedFn): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected markAsTouched(): void {
    this.onTouched();
    this.control?.markAsTouched();
  }

  protected setValue(value: T): void {
    this.value.set(value);
    this.onChange(value);
  }

  private refreshFormField() {
    this.refreshCounter.update((n) => n + 1);
  }
}
