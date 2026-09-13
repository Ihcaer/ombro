import { basics } from './basics';
import { blur } from './blur';
import { colors } from './colors';
import { fontWeight } from './font-weight';
import { shadowOffset } from './shadow-offset';
import { size } from './size';
import { spacing } from './spacing';

export const customPrimitives = {
  ...basics,
  color: colors,
  spacing,
  fontSize: size,
  fontWeight,
  blur,
  shadowOffset,
};
