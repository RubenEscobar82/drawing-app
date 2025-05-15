const roundToTwoDecimals = (num: number, down?: boolean): number => {
  return parseFloat(
    parseFloat(
      `${(down ? Math.floor(num * 100) : Math.ceil(num * 100)) / 100}`
    ).toFixed(2)
  );
};

export { roundToTwoDecimals };
