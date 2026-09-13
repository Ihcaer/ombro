import { BaseTokenSections } from '@primeuix/themes/types/base';
import { fontColor } from './font/font-color';
import { formField } from './general/form-field';

export const semantic: BaseTokenSections.Semantic = {
  colorScheme: {
    dark: {
      primary: {
        50: '{customPrimitive.color.brandBlue.50}',
        100: '{customPrimitive.color.brandBlue.100}',
        200: '{customPrimitive.color.brandBlue.200}',
        300: '{customPrimitive.color.brandBlue.300}',
        400: '{customPrimitive.color.brandBlue.400}',
        500: '{customPrimitive.color.brandBlue.500}',
        600: '{customPrimitive.color.brandBlue.600}',
        700: '{customPrimitive.color.brandBlue.700}',
        800: '{customPrimitive.color.brandBlue.800}',
        900: '{customPrimitive.color.brandBlue.900}',
        950: '{customPrimitive.color.brandBlue.950}',
      },
      text: fontColor,
      formField,
    },
  },
};
