import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { LabelComponent } from '../common/label/label.component';
import { ErrorMessageComponent } from '../common/validating/error-message.component';
import { BaseToggleControl } from '../base-toggle-control';

@Component({
  selector: 'ombro-checkbox',
  imports: [CheckboxModule, FormsModule, LabelComponent, ErrorMessageComponent],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent extends BaseToggleControl {
  readonly label = input<string>();
  readonly binary = input<boolean>(true);
  readonly valueAttribute = input<unknown>();
}
