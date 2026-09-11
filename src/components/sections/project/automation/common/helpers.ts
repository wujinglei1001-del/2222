export const getUnusedOptions = <T, V>(
  all: T[],
  used: V[],
  excludeIndex?: number,
  getValue: (item: T) => V = (item) => item as unknown as V,
): T[] => {
  const usedValues =
    excludeIndex !== undefined ? used.filter((_, index) => index !== excludeIndex) : used;

  return all.filter((option) => !usedValues.includes(getValue(option)));
};
