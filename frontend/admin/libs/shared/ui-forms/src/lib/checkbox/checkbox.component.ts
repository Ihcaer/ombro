import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IdGeneratorService } from '@ombro/shared/util-ui';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { OnChangeFn, OnTouchedFn } from '../../types';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'ombro-checkbox',
  imports: [CheckboxModule, FormsModule, LabelComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
  private idGeneratorService = inject(IdGeneratorService);

  label = input<string>();
  binary = input<boolean>(false);
  valueAttribute = input<unknown>();

  protected value = signal<unknown>(false);
  protected isDisabled = signal<boolean>(false);
  protected inputId = this.idGeneratorService.generate('checkbox');

  onChange: OnChangeFn<unknown> = () => {
    /* empty */
  };
  onTouched: OnTouchedFn = () => {
    /* empty */
  };

  writeValue(val: unknown): void {
    this.value.set(val);
  }
  registerOnChange(fn: OnChangeFn<unknown>): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: OnTouchedFn): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleCheckboxChange(event: CheckboxChangeEvent): void {
    this.value.set(event);
    this.onChange(event);
  }
}
