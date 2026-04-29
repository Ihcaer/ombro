import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent, IconName } from '@ombro/shared/ui-icons';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-auth-wrapper',
  imports: [IconComponent, LogoComponent],
  templateUrl: './auth-wrapper.component.html',
  styles: `
    @use '../../styles/common.scss';
    .heading {
      margin-bottom: common.$elementsGap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthWrapperComponent {
  /**  @see {@link IconComponent} */
  readonly icon = input<IconName>();
}
