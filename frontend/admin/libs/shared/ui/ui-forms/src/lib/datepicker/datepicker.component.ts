import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule, DatePickerSelectionMode } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { LabelComponent } from '../common/label/label.component';
import { IconName } from '@ombro/shared/ui/ui-icons';
import { BaseInputControl } from '../base-input-control';
import { ErrorMessageComponent } from '../common/validating/error-message.component';

type DatepickerSelectionMode = DatePickerSelectionMode;

@Component({
  selector: 'ombro-datepicker',
  imports: [DatePickerModule, FormsModule, LabelComponent, InputMaskModule, ErrorMessageComponent],
  templateUrl: './datepicker.component.html',
  styles: `
    @use '../../styles/common.scss';
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerComponent extends BaseInputControl<Date | Date[] | null> {
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
}
