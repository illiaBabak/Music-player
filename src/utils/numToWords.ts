const units = ['', 'thousand', 'million'];

export const numToWords = (num: number): string => {
  let unitIndex = 0;

  while (num >= 1000 && ++unitIndex) num /= 1000;

  return `${num.toFixed(0)} ${units[unitIndex]}${Number(num.toFixed(0)) > 1 && unitIndex > 0 ? 's' : ''}`.trim();
};
