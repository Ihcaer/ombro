import { computed, Directive } from '@angular/core';
import { AuthPageBase } from '../auth-page-base';
import { AUTH_PAGE_PATHS, AUTH_PATH_SLUG } from '../../auth-paths';

@Directive()
export abstract class PasswordResetBase extends AuthPageBase {
  // protected readonly LOGIN_LINK = `/${AUTH_PATH_SLUG}/${LOGIN_PAGE_SLUG}` as const;
  protected readonly LOGIN_LINK = `/${AUTH_PATH_SLUG}/${AUTH_PAGE_PATHS.LOGIN}` as const;
  protected showSuccess: boolean = false;

  protected readonly isRequestSucceed = computed(() => {
    if (!this.showSuccess) return null;

    const isLoading = this.authStore.isLoading();
    const hasError = !!this.authStore.lastErrorResponse();

    return !isLoading && !hasError;
  });
}
