import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IdGeneratorService } from '@ombro/shared/util-ui';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { LabelComponent } from '../label/label.component';
import { IconName } from '@ombro/shared/ui-icons';
import { BaseCvaComponent } from '../base-cva-component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

type DatepickerSelectionMode = DatePicker['selectionMode'];

@Component({
  selector: 'ombro-datepicker',
  imports: [DatePickerModule, FormsModule, LabelComponent, InputMaskModule, ErrorMessageComponent],
  templateUrl: './datepicker.component.html',
  styles: `
    @use '../../styles/common.scss';
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerComponent extends BaseCvaComponent<Date | Date[] | null> {
  private readonly idGeneratorService = inject(IdGeneratorService);

  label = input<string>();
  labelIcon = input<IconName>();
  dateFormat = input<string>('dd.mm.yy');
  showIcon = input<boolean>(true);
  placeholder = input<string>();

  /** Mask documentation: https://primeng.org/inputmask */
  mask = input<string>();
  /**  Following inputs documentation: https://primeng.org/datepicker */
  minDate = input<Date>();
  maxDate = input<Date>();
  selectionMode = input<DatepickerSelectionMode>('single');
  showTime = input<boolean>(false);
  onlyTime = input<boolean>(false);

  protected readonly inputId = this.idGeneratorService.generate('datepicker');

  override writeValue(value: Date | null): void {
    this.value.set(value);
  }

  protected handleDateChange(value: Date | null): void {
    this.setValue(value);
  }

  protected handleBlur(): void {
    this.markAsTouched();
  }
}
