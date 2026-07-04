import { ComponentsDesignTokens } from '@primeuix/themes/types';
import { breadcrumb } from './breadcrumb';
import { button } from './button';
import { message } from './message';
import { dialog } from './dialog';

export const components: ComponentsDesignTokens = {
  breadcrumb,
  button,
  message,
  dialog,
} as const;
