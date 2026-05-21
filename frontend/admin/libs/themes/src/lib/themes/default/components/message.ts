import { MessageDesignTokens } from '@primeuix/themes/types/message';

export const message: MessageDesignTokens = {
  colorScheme: {
    dark: {
      error: {
        background: '{dustyRose.700}',
        borderColor: '{dustyRose.300}',
        color: '{dustyRose.300}',
      },
      success: {
        background: '{sageGreen.700}',
        borderColor: '{sageGreen.300}',
        color: '{sageGreen.300}',
      },
    },
  },
} as const;
