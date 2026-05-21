import { BreadcrumbDesignTokens } from '@primeuix/themes/types/breadcrumb';

export const breadcrumb: BreadcrumbDesignTokens & {
  colorScheme: { dark: { item: { colorCurrent: string } } };
} = {
  colorScheme: {
    dark: {
      root: { background: '{customVariables.default.bgSurfaceSubtle}' },
      item: {
        color: '{primary.400}',
        colorCurrent: '{primary.300}',
        hoverColor: '{primary.300}',
      },
      separator: { color: '{grey.400}' },
    },
  },
} as const;
