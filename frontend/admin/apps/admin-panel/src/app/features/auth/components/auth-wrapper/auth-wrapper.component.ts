import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { IconComponent, IconName } from '@ombro/shared/ui/ui-icons';
import { LogoComponent } from '@ombro/admin-panel/app/shared/components/logo/logo.component';
import { MessageModule } from 'primeng/message';
import { AuthStore } from '@ombro/admin-panel/app/core/auth/store/auth.store';
import { mapAuthHttpErrorToMessage } from '../../utils/mapAuthHttpErrorToMessage.util';
import { ErrorResponseBody } from '@ombro/admin-panel/app/core/config/types/error-response-body.type';

@Component({
  selector: 'app-auth-wrapper',
  imports: [IconComponent, LogoComponent, MessageModule],
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
  private readonly authStore = inject(AuthStore);

  /**  @see {@link IconComponent} */
  readonly icon = input<IconName>();

  protected readonly errorMessage = computed<string | null>(() => {
    const errorBody = this.authStore.lastResponseError()?.error as ErrorResponseBody | null;
    if (!errorBody) return null;
    const errorCode = errorBody.errorCode;

    return mapAuthHttpErrorToMessage(errorCode);
  });
}
