export const button = {
  root: {
    borderRadius: '{borderRadius.md}',
    gap: '{customPrimitive.spacing.2}',
    paddingX: '{customPrimitive.spacing.4}',
    paddingY: '{customPrimitive.spacing.2}',
  },
  colorScheme: {
    dark: {
      root: {
        // severity="primary"
        primary: {
          background: '{primary.300}',
          color: '{customPrimitive.color.grey.700}',
          borderColor: '{primary.300}',

          hoverBackground: '{primary.200}',
          hoverBorderColor: '{primary.200}',

          activeBackground: '{primary.100}',
          activeBorderColor: '{primary.100}',
        },
        // severity="secondary"
        secondary: {
          background: '{customPrimitive.color.grey.300}',
          color: '{customPrimitive.color.grey.700}',
          borderColor: '{customPrimitive.color.grey.300}',

          hoverBackground: '{customPrimitive.color.grey.200}',
          hoverBorderColor: '{customPrimitive.color.grey.200}',

          activeBackground: '{customPrimitive.color.grey.100}',
          activeBorderColor: '{customPrimitive.color.grey.100}',
        },
        // severity="success"
        success: {
          background: '{customPrimitive.color.sageGreen.400}',
          color: '{customPrimitive.color.grey.700}',
          borderColor: '{customPrimitive.color.sageGreen.400}',

          hoverBackground: '{customPrimitive.color.sageGreen.300}',
          hoverBorderColor: '{customPrimitive.color.sageGreen.300}',

          activeBackground: '{customPrimitive.color.sageGreen.200}',
          activeBorderColor: '{customPrimitive.color.sageGreen.200}',
        },
        // severity="warn"
        warn: {
          background: '{customPrimitive.color.amberEarth.300}',
          color: '{customPrimitive.color.grey.700}',
          borderColor: '{customPrimitive.color.amberEarth.300}',

          hoverBackground: '{customPrimitive.color.amberEarth.200}',
          hoverBorderColor: '{customPrimitive.color.amberEarth.200}',

          activeBackground: '{customPrimitive.color.amberEarth.100}',
          activeBorderColor: '{customPrimitive.color.amberEarth.100}',
        },
        // severity="danger"
        danger: {
          background: '{customPrimitive.color.dustyRose.500}',
          color: '{customPrimitive.color.grey.700}',
          borderColor: '{customPrimitive.color.dustyRose.500}',

          hoverBackground: '{customPrimitive.color.dustyRose.400}',
          hoverBorderColor: '{customPrimitive.color.dustyRose.400}',

          activeBackground: '{customPrimitive.color.dustyRose.300}',
          activeBorderColor: '{customPrimitive.color.dustyRose.300}',
        },
      },
      text: {
        primary: { color: '{primary.300}' },
        secondary: { color: '{customPrimitive.color.grey.300}' },
      },
    },
  },
} as const;
