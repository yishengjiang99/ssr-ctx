export type MixerFunction = (vals: DataView[], index: number) => number;

export const defaultMixer = (inputviews: DataView[], k: number) => {
  let sum = 0;
  for (let j = inputviews.length - 1; j >= 0; j--) {
    sum += inputviews[j].getFloat32(k, true);
  }
  return sum;
};
