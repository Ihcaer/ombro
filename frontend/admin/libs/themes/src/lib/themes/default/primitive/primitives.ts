import { basics } from './basics';
import { colors } from './colors';
import { radius } from './radius';
import { size } from './size';
import { spacing } from './spacing';
import { fontWeight } from './font-weight';

export const primitives = { ...basics, ...colors, radius, spacing, size, fontWeight } as const;
