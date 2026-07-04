export const surface = {
  primary: {
    'bg-color': '{brandBlue.700}',
    padding: '{spacing.2}',
    gap: { vertical: '{spacing.0}', horizontal: '{spacing.5}' },
  },
  secondary: {
    'bg-color': '{brandBlue.600}',
    border: {
      width: '{borderWidth.sm}',
      style: '{borderStyle.solid}',
      color: 'rgba(255, 255, 255, 0.1)',
      radius: '{radius.2xl}',
    },
  },
  panel: {
    bg: {
      color: '#ffffff0a',
      blur: '{blur.sm}',
    },
    border: {
      width: '{borderWidth.sm}',
      style: '{borderStyle.solid}',
      color: 'rgba(255, 255, 255, 0.1)',
      radius: '{radius.2xl}',
    },
  },
} as const;
