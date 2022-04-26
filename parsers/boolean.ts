import { oneOf } from '~combinators/mod.ts';
import { literal } from './string.ts';

export const boolean = oneOf(
  literal('false').map((_) => false),
  literal('true').map((_) => true)
)
  .setExpects('boolean')
  .mapErr(() => 'expected a boolean');
