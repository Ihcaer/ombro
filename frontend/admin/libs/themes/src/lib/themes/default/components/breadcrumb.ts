import { BreadcrumbDesignTokens } from '@primeuix/themes/types/breadcrumb';

export const breadcrumb: BreadcrumbDesignTokens & {
  colorScheme: { dark: { item: { colorCurrent: string } } };
} = {
  colorScheme: {
    dark: {
      root: { background: '{customSemantic.surface.panel.bg-color}' },
      item: {
        color: '{primary.400}',
        colorCurrent: '{primary.300}',
        hoverColor: '{primary.300}',
      },
      separator: { color: '{customPrimitive.color.grey.400}' },
    },
  },
} as const;
