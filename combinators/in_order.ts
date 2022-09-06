import { Parser, Input } from '~types/parser.ts';
import { Triple, Pair, Show } from '~ds/containers.ts';

export function inOrder<T extends Show, U extends Show>(
  p1: Parser<T>,
  p2: Parser<U>
): Parser<Pair<T, U>>;
export function inOrder<T extends Show, U extends Show, V extends Show>(
  p1: Parser<T>,
  p2: Parser<U>,
  p3: Parser<V>
): Parser<Triple<T, U, V>>;

export function inOrder(
  p1: Parser<Show>,
  p2: Parser<Show>,
  p3?: Parser<Show>
): Parser<Triple<Show, Show, Show>> | Parser<Pair<Show, Show>> {
  return Parser.new({
    parse(input: Input) {
      const o1 = p1.parse(input);
      if ('error' in o1) return o1;
      const o2 = p2.parse(o1);
      if ('error' in o2) return o2;
      const o3 = p3?.parse(o2);
      if (o3 && 'error' in o3) return o3;

      if (o3)
        return {
          result: Triple.new(o1.result, o2.result, o3.result),
          source: input.source,
          span: { ...o3.span, lo: o1.span.lo },
        };
      return {
        result: Pair.new(o1.result, o2.result),
        source: input.source,
        span: { ...o2.span, lo: o1.span.lo },
      };
    },
    expects: `${[p1, p2, p3]
      .map((p) => p?.expects)
      .filter(Boolean)
      .join(', ')} in succession`,
  });
}
