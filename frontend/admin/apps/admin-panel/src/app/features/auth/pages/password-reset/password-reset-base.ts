import { computed, Directive, signal } from '@angular/core';
import { AuthPageBase } from '../auth-page-base';
import { AUTH_PAGE_PATHS, AUTH_PATH_SLUG } from '../../auth-paths';

@Directive()
export abstract class PasswordResetBase extends AuthPageBase {
  protected readonly LOGIN_LINK = `/${AUTH_PATH_SLUG}/${AUTH_PAGE_PATHS.LOGIN}` as const;
  protected showSuccess = signal<boolean>(false);

  protected readonly isRequestSucceed = computed(() => {
    if (!this.showSuccess()) return false;

    const isLoading = this.authStore.isLoading();
    const hasError = !!this.authStore.lastResponseError();

    return !isLoading && !hasError;
  });
}
