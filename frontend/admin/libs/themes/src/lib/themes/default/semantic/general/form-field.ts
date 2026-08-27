import { BaseTokenSections } from '@primeuix/themes/types/base';

export const formField: BaseTokenSections.Semantic['formField'] = {
  fontSize: '{customPrimitive.fontSize.16}',
  paddingX: '{customPrimitive.spacing.3}',
  paddingY: '{customPrimitive.spacing.2}',
  background: '{primary.700}',
  borderColor: '#FFFFFF14',
  invalidBorderColor: '{customPrimitive.color.dustyRose.300}',
  color: '{text.colorEmphasis}',
  invalidPlaceholderColor: '{customPrimitive.color.dustyRose.500}',
} as const;
