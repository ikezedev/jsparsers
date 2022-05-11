import { Parser } from '~types/parser.ts';
import { Show } from '../ds/containers.ts';
import { inOrder } from './in_order.ts';

export const surroundedBy = <T>(
  start: Parser<Show>,
  parser: Parser<T>,
  end?: Parser<Show>
): Parser<T> =>
  inOrder(start, parser, end ?? start).map(({ result }) => result.second);
