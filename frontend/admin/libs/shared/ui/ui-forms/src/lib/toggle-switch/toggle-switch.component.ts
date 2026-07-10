import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { IdGeneratorService } from '@ombro/shared/utils/util-id';
import { BaseCvaComponent } from '../base-cva-component';

@Component({
  selector: 'ombro-toggle-switch',
  imports: [ToggleSwitchModule, FormsModule],
  templateUrl: './toggle-switch.component.html',
  styles: `
    @use '../../styles/common.scss';
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleSwitchComponent extends BaseCvaComponent<boolean> {
  private idGeneratorService = inject(IdGeneratorService);

  inputId = this.idGeneratorService.generate('toggle-switch');

  handleToggleChange(value: boolean): void {
    this.setValue(value);
    this.markAsTouched();
  }
}
