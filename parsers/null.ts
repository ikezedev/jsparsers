import { literal } from './literal.ts';

export const nullParser = literal('null')
  .map(() => null)
  .mapErr((_) => 'expected null')
  .setExpects('null');
