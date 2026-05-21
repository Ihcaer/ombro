import { ComponentsDesignTokens } from '@primeuix/themes/types';
import { breadcrumb } from './breadcrumb';
import { button } from './button';
import { message } from './message';

export const components: ComponentsDesignTokens = {
  breadcrumb: breadcrumb,
  button: button,
  message: message,
} as const;
