import { Parser } from '~types/parser.ts';
import { inOrder } from './in_order.ts';

export const surroundedBy = <T, U, V>(
  start: Parser<U>,
  parser: Parser<T>,
  end: Parser<V>
): Parser<T> => inOrder(start, parser, end).map(({ result }) => result.second);
