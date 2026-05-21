import { customVariables } from './misc/custom-variables';
import { fontColor } from './font/font-color';
import { fontSize } from './font/font-size';
import { formField } from './misc/formField';
import { meterColors } from './misc/meter';

export const semantic = {
  primary: {
    50: '{brandBlue.50}',
    100: '{brandBlue.100}',
    200: '{brandBlue.200}',
    300: '{brandBlue.300}',
    400: '{brandBlue.400}',
    500: '{brandBlue.500}',
    600: '{brandBlue.600}',
    700: '{brandBlue.700}',
    800: '{brandBlue.800}',
    900: '{brandBlue.900}',
    950: '{brandBlue.950}',
  },
  colorScheme: {
    dark: {
      surface: {
        100: '{grey.100}',
        200: '{grey.200}',
        300: '{grey.300}',
        400: '{grey.400}',
        500: '{grey.500}',
        600: '{grey.600}',
        700: '{grey.700}',
      },
      text: fontColor,
      customVariables,
      formField,
      meter: meterColors,
    },
  },
  fontSize,
};
