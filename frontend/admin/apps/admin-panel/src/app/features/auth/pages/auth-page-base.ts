import { Directive, inject } from '@angular/core';
import { AuthStore } from '@ombro/admin-panel/app/core/auth/store';

@Directive()
export abstract class AuthPageBase {
  protected readonly authStore = inject(AuthStore);
  protected abstract onSubmit(): void;
}
