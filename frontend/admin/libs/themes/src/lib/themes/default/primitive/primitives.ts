import { basics } from './basics';
import { colors } from './colors';
import { radius } from './radius';
import { size } from './size';
import { spacing } from './spacing';
import { fontWeight } from './font-weight';
import { blur } from './blur';
import { shadowOffset } from './shadow-offset';

export const primitives = {
  ...basics,
  ...colors,
  radius,
  spacing,
  size,
  fontWeight,
  blur,
  shadowOffset,
} as const;
