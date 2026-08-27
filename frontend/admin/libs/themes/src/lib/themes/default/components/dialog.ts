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

const padding = '{customPrimitive.spacing.6}';
const gap = '{customPrimitive.spacing.4}';

export const dialog: DialogDesignTokens & AdditionalDialogDesignTokens = {
  root: {
    background: 'rgb(32 32 34 / 0.3)',
    borderColor: '{customPrimitive.surface.panel.border.color}',
    color: '{text.color}',
    borderRadius: '{borderRadius.2xl}',
    shadow:
      '0 {customPrimitive.shadow-offset.10} {customPrimitive.blur.2xl} rgba(86, 133, 199, 0.1)',
  },
  header: { padding: `${padding} ${padding} 0`, gap: '{customPrimitive.spacing.2}' },
  title: {
    fontSize: '{customPrimitive.fontSize.heading.lg}',
    fontWeight: '{customPrimitive.fontWeight.600}',
  },
  content: { padding: `${gap} ${padding}` },
  footer: { padding: `0 ${padding} ${padding}`, gap: '{customPrimitive.spacing.1.5}' },
  additional: {
    backdropBlur: '{customPrimitive.blur.lg}',
    headerIconSize: '{customPrimitive.fontSize.28}',
    titleColor: '{text.colorEmphasis}',
    maskBackground: 'rgba(0, 0, 0, 0.5)',
    contentFontSize: '{customPrimitive.fontSize.body.md}',
    margin: '{customPrimitive.spacing.5}',
    buttonFontSize: '{customPrimitive.fontSize.body.md}',
  },
};
