import { ChangeDetectionStrategy, Component, forwardRef, inject, signal } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { IdGeneratorService } from '@ombro/shared/util-ui';
import { OnChangeFn, OnTouchedFn } from '../../types';

@Component({
  selector: 'ombro-toggle-switch',
  imports: [ToggleSwitchModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleSwitchComponent),
      multi: true,
    },
  ],
  templateUrl: './toggle-switch.component.html',
  styleUrl: './toggle-switch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleSwitchComponent {
  private idGeneratorService = inject(IdGeneratorService);

  protected isDisabled = signal<boolean>(false);
  protected isChecked = signal<boolean>(false);

  inputId = this.idGeneratorService.generate('toggle-switch');

  onChange: OnChangeFn<boolean> = () => {
    /* empty */
  };
  onTouched: OnTouchedFn = () => {
    /* empty */
  };

  writeValue(val: unknown): void {
    const newValue: boolean = typeof val === 'boolean' ? val : false;
    this.isChecked.set(newValue);
  }
  registerOnChange(fn: OnChangeFn<boolean>): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: OnTouchedFn): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleToggleChange(newValue: boolean): void {
    this.isChecked.set(newValue);
    this.onChange(newValue);
    this.onTouched();
  }
}
