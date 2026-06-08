export const layout = {
  shell: {
    'bg-color': '{brandBlue.700}',
    padding: '{spacing.2}',
    gap: { vertical: '{spacing.0}', horizontal: '{spacing.5}' },
  },
  panel: {
    'bg-color': '#ffffff0a',
    border: {
      width: '{borderWidth.sm}',
      style: '{borderStyle.solid}',
      color: '#ffffff1a',
      radius: '{radius.2xl}',
    },
  },
  card: {
    'bg-color': '{brandBlue.600}',
    border: {
      width: '{borderWidth.sm}',
      style: '{borderStyle.solid}',
      color: '#ffffff1a',
      radius: '{radius.2xl}',
    },
  },
} as const;
