import { Parser, Input } from '~types/parser.ts';
import { Triple, Pair } from '~ds/container.ts';

export function inOrder<T, U>(p1: Parser<T>, p2: Parser<U>): Parser<Pair<T, U>>;
export function inOrder<T, U, V>(
  p1: Parser<T>,
  p2: Parser<U>,
  p3: Parser<V>
): Parser<Triple<T, U, V>>;

export function inOrder(
  p1: Parser<unknown>,
  p2: Parser<unknown>,
  p3?: Parser<unknown>
): Parser<Triple<unknown, unknown, unknown>> | Parser<Pair<unknown, unknown>> {
  return Parser.new({
    parse(input: Input) {
      const o1 = p1.parse(input);
      if ('error' in o1) return o1;
      const o2 = p2.parse(o1.input);
      if ('error' in o2) return o2;
      const o3 = p3?.parse(o2.input);
      if (o3 && 'error' in o3) return o3;

      if (o3)
        return {
          result: Triple.new(o1.result, o2.result, o3.result),
          input: {
            ...o3.input,
            span: { ...o3.input.span, lo: o1.input.span.lo },
          },
        };
      return {
        result: Pair.new(o1.result, o2.result),
        input: {
          ...o2.input,
          span: { ...o2.input.span, lo: o1.input.span.lo },
        },
      };
    },
    expects: `${[p1, p2, p3]
      .map((p) => p?.expects)
      .filter(Boolean)
      .join(', ')} in succession`,
  });
}
