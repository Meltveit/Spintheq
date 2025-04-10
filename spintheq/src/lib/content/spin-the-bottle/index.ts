// src/lib/content/spin-the-bottle/index.ts

import { casualQuestions } from './casual';
import { spicyQuestions } from './spicy';
import { couplesQuestions } from './couples';

export const categories = {
  'Casual': casualQuestions,
  'Spicy': spicyQuestions,
  'Couples': couplesQuestions
} as const;

export type CategoryKey = keyof typeof categories;
// Use 'export type' syntax for re-exporting types when isolatedModules is enabled
export type { Question } from './types';