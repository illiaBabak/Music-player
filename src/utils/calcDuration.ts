import { DIVIDE_FACTOR, MULTIPLACTION_FACTOR } from './constants';

export const calcDuration = (text: string): number => {
  if (!text) return 0;

  return Math.ceil(text.length / DIVIDE_FACTOR) * MULTIPLACTION_FACTOR;
};
