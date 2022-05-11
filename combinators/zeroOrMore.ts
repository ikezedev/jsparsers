import { Parser } from '~types/parser.ts';
import { literal } from '../parsers/mod.ts';
import { oneOf } from './one_of.ts';
import { oneOrMore } from './one_or_more.ts';

export const zeroOrMore = <T>(parser: Parser<T>): Parser<T[]> =>
  oneOf(
    oneOrMore(parser),
    literal``.mapResult(() => [])
  );
