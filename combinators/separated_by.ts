import { Parser } from '~types/parser.ts';
import { inOrder } from './in_order.ts';
import { oneOrMore } from './one_or_more.ts';
import { zeroOrMore } from './zeroOrMore.ts';

export const separatedBy = <T, U>(
  parser: Parser<T>,
  separator: Parser<U>,
  allowTrailing = false
): Parser<T[]> =>
  allowTrailing
    ? oneOrMore(inOrder(parser, separator).map(({ result }) => result.first))
    : inOrder(
        parser,
        zeroOrMore(
          inOrder(separator, parser).map(({ result }) => result.second)
        )
      ).map(({ result }) => [result.first, ...result.second]);
