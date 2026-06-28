import { fontColor } from './font/font-color';
import { fontSize } from './font/font-size';
import { formField } from './general/form-field';
import { meterColors } from './general/meter';
import { misc } from './general/miscellaneous';
import { surface } from './surface';

export const semantic = {
  colorScheme: {
    dark: {
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
      surface: surface,
      text: fontColor,
      misc,
      formField,
      meter: meterColors,
    },
  },
  fontSize,
};
