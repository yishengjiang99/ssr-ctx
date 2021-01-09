export const compression = (value: number, threshold: number, ratio: number, knee: number): number => {
  if (value < threshold && value > -1 * threshold) return value;
  let ab = Math.abs(value);
  if (ab > threshold) ab = threshold + (ab - threshold) / ratio;
  if (ab > threshold * 1.2) ab = threshold * 1.2 + (ab - threshold * 1.2) / ratio / 1.3;
  if (ab > threshold * 1.3) ab = threshold * 1.3 + (ab - threshold * 1.3) / ratio / 1.4;
  if (ab > threshold + knee) ab = threshold + knee + (ab - threshold + knee) / ratio / 3;
  if (ab > 0.7) ab = 0.7;
  const val = ab * (value < 0 ? -1 : 1);
  return Math.max(-1, Math.min(1, val));
};
