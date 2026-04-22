import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent, IconName } from '@ombro/shared/ui-icons';

@Component({
  selector: 'ombro-input-label',
  imports: [IconComponent],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent {
  inputId = input.required<string>();
  /**
   * Description: {@link IconComponent}
   */
  iconName = input<IconName>();
  disabled = input<boolean>(false);
}
