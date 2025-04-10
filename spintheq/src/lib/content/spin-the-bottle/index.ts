// C:\litt_av_hvert_nett\Spintheq\spintheq\src\lib\content\spin-the-bottle\index.ts

import { casualQuestions } from './casual';
import { spicyQuestions } from './spicy';
import { couplesQuestions } from './couples';
import { Question } from './types';

export const categories: Record<string, Question[]> = {
  'Casual': casualQuestions,
  'Spicy': spicyQuestions,
  'Couples': couplesQuestions
};

export type CategoryKey = keyof typeof categories;
export { Question } from './types';