const roundToTwoDecimals = (num: number, down?: boolean): number => {
  return parseFloat(
    parseFloat(
      `${(down ? Math.floor(num * 100) : Math.ceil(num * 100)) / 100}`
    ).toFixed(2)
  );
};

const clampValue = (args: { min?: number; value: number; max?: number }) => {
  const { min, max } = args;
  let { value } = args;

  if (min || min === 0) {
    value = Math.max(min, value);
  }
  if (max || max === 0) {
    value = Math.min(max, value);
  }
  return value;
};

const float2Percentage = (input: number) => `${Math.floor(input * 100)}%`;

export { roundToTwoDecimals, clampValue, float2Percentage };
