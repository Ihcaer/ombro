// To see available properties values, enter https://fonts.google.com/icons.
/**
 * NOTE ON ORDERING: The values in size and weight arrays must be consecutive,
 * meaning if '20' and '32' are present, '24' must also be present
 * in the sequence.
 * * The FIRST number in the tables is the DEFAULT VALUE.
 * * Example:
 * [20, 24, 32] -> OK (20 is default)
 * [20, 32]    -> INVALID (Missing 16)
 * [32, 24, 20] -> OK (Reverse order is fine)
 * [20, 24, 24, 32] -> OK (Duplicates are fine, but not recommended)
 */
export const iconProperties = {
  size: [20, 24] as const,
  weight: [400, 500, 600] as const,
  fill: [0, 1] as const,
  grade: [0] as const,
};

type MapArrayToBoolean<T extends readonly number[]> = T extends readonly [0]
  ? false
  : T extends readonly [1]
  ? true
  : boolean;

export type AvailableSize = (typeof iconProperties.size)[number];
export type AvailableWeight = (typeof iconProperties.weight)[number];
export type AvailableFill = MapArrayToBoolean<typeof iconProperties.fill>;
export type AvailableGrade = (typeof iconProperties.grade)[number];
