export const button = {
  root: {
    borderRadius: '{radius.md}',
    gap: '{spacing.2}',
    paddingX: '{spacing.4}',
    paddingY: '{spacing.2}',
  },
  colorScheme: {
    dark: {
      root: {
        // severity="primary"
        primary: {
          background: '{primary.300}',
          color: '{grey.700}',
          borderColor: '{primary.300}',

          hoverBackground: '{primary.200}',
          hoverBorderColor: '{primary.200}',

          activeBackground: '{primary.100}',
          activeBorderColor: '{primary.100}',
        },
        // severity="secondary"
        secondary: {
          background: '{grey.300}',
          color: '{grey.700}',
          borderColor: '{grey.300}',

          hoverBackground: '{grey.200}',
          hoverBorderColor: '{grey.200}',

          activeBackground: '{grey.100}',
          activeBorderColor: '{grey.100}',
        },
        // severity="success"
        success: {
          background: '{sageGreen.400}',
          color: '{grey.700}',
          borderColor: '{sageGreen.400}',

          hoverBackground: '{sageGreen.300}',
          hoverBorderColor: '{sageGreen.300}',

          activeBackground: '{sageGreen.200}',
          activeBorderColor: '{sageGreen.200}',
        },
        // severity="warn"
        warn: {
          background: '{amberEarth.300}',
          color: '{grey.700}',
          borderColor: '{amberEarth.300}',

          hoverBackground: '{amberEarth.200}',
          hoverBorderColor: '{amberEarth.200}',

          activeBackground: '{amberEarth.100}',
          activeBorderColor: '{amberEarth.100}',
        },
        // severity="danger"
        danger: {
          background: '{dustyRose.500}',
          color: '{grey.700}',
          borderColor: '{dustyRose.500}',

          hoverBackground: '{dustyRose.400}',
          hoverBorderColor: '{dustyRose.400}',

          activeBackground: '{dustyRose.300}',
          activeBorderColor: '{dustyRose.300}',
        },
      },
      text: { secondary: { color: '{grey.300}' } },
    },
  },
} as const;
