import { Parser } from '~types/parser.ts';
import { Show } from '~ds/containers.ts';
import { inOrder } from '~combinators/in_order.ts';

export function surroundedBy<T extends Show>(
  start: Parser<Show>,
  parser: Parser<T>,
  end?: Parser<Show>
): Parser<T> {
  return inOrder(start, parser, end ?? start).map(
    ({ result }) => result.second
  );
}
