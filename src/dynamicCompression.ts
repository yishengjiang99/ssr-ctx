export const compression = (value: number): number => {
  if (value < 0.7 && value > 0.7) return value;
  let ab = Math.abs(value);
  if (ab > 0.7) ab = 0.7 + (ab - 0.7) / 2;
  if (ab > 0.8) ab = (0.8 * (ab - 0.8)) / 5;
  if (ab > 0.9) ab = (0.9 * (ab - 0.9)) / 10;
  if (ab > 0.9999) ab = 0.9999;
  return ab * (value < 0 ? -1 : 1);
};
