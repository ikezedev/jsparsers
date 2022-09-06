import { Parser } from '~types/parser.ts';
import { Tuple } from '~types/util.ts';
import { oneOrMore } from './one_or_more.ts';

export const len2 = <T, N extends number>(
  parser: Parser<T>,
  length: N
): Parser<Tuple<T, N>> =>
  (() => {
    return oneOrMore(parser).chain(({ result, ...rest }) => {
      if (result.length === length)
        return { result: result as Tuple<T, N>, ...rest };
      else
        return {
          error: `expected ${length} occurrences of ${parser.expects}`,
          ...rest,
        };
    });
  })();

export function len<T, N extends number>(parser: Parser<T>, length: N) {
  return oneOrMore(parser).chain(({ result, ...rest }) => {
    if (result.length === length)
      return { result: result as Tuple<T, N>, ...rest };
    else
      return {
        error: `expected ${length} occurrences of ${parser.expects}`,
        ...rest,
      };
  });
}
