import { signal } from '@angular/core';
import { AuthStore } from '@ombro/admin-panel/app/core/auth/store';
import { noop } from 'rxjs';

const mockAuthStoreValues = {
  isLoading: signal(false),
  lastErrorResponse: signal(null),
  login: noop,
  requestPasswordReset: noop,
  resetPassword: noop,
  finalizeAdminRegistration: noop,
};

export const AUTH_PAGE_BASE_TESTING_PROVIDERS = [
  { provide: AuthStore, useValue: mockAuthStoreValues },
] as const;
