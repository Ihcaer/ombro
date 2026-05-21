import { basics } from './basics';
import { colors } from './colors';
import { radius } from './radius';
import { size } from './size';
import { spacing } from './spacing';

export const primitives = { ...basics, ...colors, radius, spacing, size } as const;
