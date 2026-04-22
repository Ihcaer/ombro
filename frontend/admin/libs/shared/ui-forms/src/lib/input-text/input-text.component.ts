import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconName } from '@ombro/shared/ui-icons';
import { IdGeneratorService } from '@ombro/shared/util-ui';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LabelComponent } from '../label/label.component';
import { OnChangeFn, OnTouchedFn } from '../../types';

@Component({
  selector: 'ombro-input-text',
  imports: [FormsModule, InputTextModule, PasswordModule, LabelComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent implements ControlValueAccessor {
  private idGeneratorService = inject(IdGeneratorService);

  type = input<'text' | 'email' | 'password'>('text');
  autocomplete = input<string>('on');
  placeholder = input<string>();
  label = input<string>();
  /**
   * Description: {@link IconComponent}
   */
  labelIcon = input<IconName>();
  invalid = input<boolean>(false);

  protected value = signal<string>('');
  protected isDisabled = signal(false);
  protected inputId = this.idGeneratorService.generate('inputText');

  onChange: OnChangeFn<string> = () => {
    /* empty */
  };
  onTouched: OnTouchedFn = () => {
    /* empty */
  };

  writeValue(val: string): void {
    this.value.set(val || '');
  }
  registerOnChange(fn: OnChangeFn<string>): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: OnTouchedFn): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleInputChange(value: string): void {
    this.value.set(value);
    this.onChange(value);
  }
}
