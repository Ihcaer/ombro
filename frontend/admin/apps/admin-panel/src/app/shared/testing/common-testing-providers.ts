import { EnvironmentProviders, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';

export const COMMON_TESTING_PROVIDERS: Array<Provider | EnvironmentProviders> = [
  provideRouter([]),
] as const;
