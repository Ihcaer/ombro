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
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { LabelComponent } from '../label/label.component';
import { OnChangeFn, OnTouchedFn } from '../../types';
import { IconName } from '@ombro/shared/ui-icons';

type DatepickerSelectionMode = DatePicker['selectionMode'];

@Component({
  selector: 'ombro-datepicker',
  imports: [DatePickerModule, FormsModule, LabelComponent, InputMaskModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerComponent {
  private idGeneratorService = inject(IdGeneratorService);

  label = input<string>();
  labelIcon = input<IconName>();
  dateFormat = input<string>('dd.mm.yy');
  showIcon = input<boolean>(true);
  placeholder = input<string>();
  // Mask documentation: https://primeng.org/inputmask
  mask = input<string>();
  // Following inputs documentation: https://primeng.org/datepicker
  minDate = input<Date>();
  maxDate = input<Date>();
  selectionMode = input<DatepickerSelectionMode>();
  showTime = input<boolean>(false);
  onlyTime = input<boolean>(false);

  protected inputId = this.idGeneratorService.generate('datepicker');
  protected value = signal<Date | null>(null);
  protected isDisabled = signal<boolean>(false);

  onChange: OnChangeFn<Date | null> = () => {
    /* empty */
  };
  onTouched: OnTouchedFn = () => {
    /* empty */
  };

  writeValue(val: Date | null | string): void {
    if (val instanceof Date || val === null) {
      this.value.set(val);
    } else if (typeof val === 'string') {
      this.value.set(new Date(val));
    } else {
      this.value.set(null);
    }
  }
  registerOnChange(fn: OnChangeFn<Date | null>): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: OnTouchedFn): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleDateChange(newDate: Date | null): void {
    this.value.set(newDate);
    this.onChange(newDate);
  }
}
