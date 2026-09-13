export const surface = {
  primary: {
    'bg-color': '{customPrimitive.color.brandBlue.700}',
    padding: '{customPrimitive.spacing.2}',
    gap: { vertical: '{customPrimitive.spacing.0}', horizontal: '{customPrimitive.spacing.5}' },
  },
  secondary: {
    'bg-color': '{customPrimitive.color.brandBlue.600}',
    border: {
      width: '{customPrimitive.borderWidth.sm}',
      style: '{customPrimitive.borderStyle.solid}',
      color: 'rgba(255, 255, 255, 0.1)',
      radius: '{borderRadius.2xl}',
    },
  },
  panel: {
    bg: {
      color: '#ffffff0a',
      blur: '{customPrimitive.blur.sm}',
    },
    border: {
      width: '{customPrimitive.borderWidth.sm}',
      style: '{customPrimitive.borderStyle.solid}',
      color: 'rgba(255, 255, 255, 0.1)',
      radius: '{borderRadius.2xl}',
    },
  },
} as const;
