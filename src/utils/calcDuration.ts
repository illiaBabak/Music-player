import { DIVIDE_FACTOR, MULTIPLACTION_FACTOR } from './constants';

export const calcDuration = (text: string): number => Math.ceil(text.length / DIVIDE_FACTOR) * MULTIPLACTION_FACTOR;
