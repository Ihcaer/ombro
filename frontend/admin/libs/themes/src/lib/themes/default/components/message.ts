import { MessageDesignTokens } from '@primeuix/themes/types/message';

export const message: MessageDesignTokens = {
  colorScheme: {
    dark: {
      error: {
        background: '{customPrimitive.color.dustyRose.700}',
        borderColor: '{customPrimitive.color.dustyRose.300}',
        color: '{customPrimitive.color.dustyRose.300}',
      },
      success: {
        background: '{customPrimitive.color.sageGreen.700}',
        borderColor: '{customPrimitive.color.sageGreen.300}',
        color: '{customPrimitive.color.sageGreen.300}',
      },
    },
  },
} as const;
