import { DialogDesignTokens } from '@primeuix/themes/types/dialog';

type AdditionalDialogDesignTokens = {
  additional: {
    backdropBlur: string;
    headerIconSize: string;
    titleColor: string;
    maskBackground: string;
    contentFontSize: string;
    margin: string;
    buttonFontSize: string;
  };
};

const padding = '{spacing.6}';
const gap = '{spacing.4}';

export const dialog: DialogDesignTokens & AdditionalDialogDesignTokens = {
  root: {
    background: 'rgb(32 32 34 / 0.3)',
    borderColor: '{surface.panel.border.color}',
    color: '{text.color}',
    borderRadius: '{radius.2xl}',
    shadow: '0 {shadow-offset.10} {blur.2xl} rgba(86, 133, 199, 0.1)',
  },
  header: { padding: `${padding} ${padding} 0`, gap: '{spacing.2}' },
  title: { fontSize: '{fontSize.heading.lg}', fontWeight: '{fontWeight.600}' },
  content: { padding: `${gap} ${padding}` },
  footer: { padding: `0 ${padding} ${padding}`, gap: '{spacing.1.5}' },
  additional: {
    backdropBlur: '{blur.lg}',
    headerIconSize: '{size.28}',
    titleColor: '{text.colorEmphasis}',
    maskBackground: 'rgba(0, 0, 0, 0.5)',
    contentFontSize: '{fontSize.body.md}',
    margin: '{spacing.5}',
    buttonFontSize: '{fontSize.body.md}',
  },
};
