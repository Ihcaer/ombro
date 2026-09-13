export const enumKeysWithout = <T extends Record<string, string | number>>(
  enumObject: T,
  excluded: readonly string[],
): string[] => {
  return Object.keys(enumObject).filter(
    (key) => Number.isNaN(Number(key)) && !excluded.includes(key),
  );
};
