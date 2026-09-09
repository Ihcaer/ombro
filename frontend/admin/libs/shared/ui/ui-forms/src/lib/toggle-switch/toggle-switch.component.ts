import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { BaseToggleControl } from '../base-toggle-control';

@Component({
  selector: 'ombro-toggle-switch',
  imports: [ToggleSwitchModule, FormsModule],
  templateUrl: './toggle-switch.component.html',
  styles: `
    @use '../../styles/common.scss';
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleSwitchComponent extends BaseToggleControl {}
