import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IdGeneratorService } from '@ombro/shared/util-ui';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { LabelComponent } from '../label/label.component';
import { BaseCvaComponent } from '../base-cva-component';

@Component({
  selector: 'ombro-checkbox',
  imports: [CheckboxModule, FormsModule, LabelComponent],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent extends BaseCvaComponent<boolean> {
  private readonly idGeneratorService = inject(IdGeneratorService);

  readonly label = input<string>();
  readonly binary = input<boolean>(true);
  readonly valueAttribute = input<unknown>();
  readonly inputId = this.idGeneratorService.generate('checkbox');

  handleCheckboxChange(event: CheckboxChangeEvent): void {
    const newValue = event.checked !== undefined ? event.checked : event;
    if (this.value() !== newValue) this.setValue(newValue);
  }

  protected handleBlur(): void {
    this.markAsTouched();
  }
}
