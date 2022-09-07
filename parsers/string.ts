import {
  oneOf,
  oneOrMore,
  inOrder,
  len,
  surroundedBy,
} from '~combinators/mod.ts';
import { Parser, Input, ParseError } from '~types/parser.ts';
import { any } from '~combinators/any.ts';
import { takeUntil } from '~combinators/take_until.ts';
import { literal as l } from '~parsers/literal.ts';

export const string = Parser.new<string>({
  parse(input: Input) {
    const { source, span } = input;
    const lo = span.hi;
    if (source.peek(lo) === '"') {
      const hi = source.substring(lo + 1).indexOf('"');
      if (hi === -1) {
        return ParseError.fromInput(
          input,
          `expected a closing quote for quote at ${lo}`
        );
      }
      return {
        result: source.substring(lo, lo + hi + 2),
        span: { lo, hi: lo + hi + 2 },
        source,
      };
    }
    return ParseError.fromInput(input, `expected a string at ${lo}`);
  },
  expects: 'string',
});

export const space = oneOf(...' \r\n\t'.split('').map(l));

export const whitespaces = oneOrMore(space);

export const optionalWhitespaces = oneOf(whitespaces, l('')).setExpects('');
