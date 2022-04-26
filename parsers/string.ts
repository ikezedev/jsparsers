import { oneOf, oneOrMore } from '~combinators/mod.ts';
import { Parser, Input } from '~types/parser.ts';

export const string = Parser.new<string>({
  parse(input: Input) {
    const { source, span } = input;
    const lo = span.hi;
    if (source[lo] === '"') {
      const hi = source.substring(lo + 1).indexOf('"');
      if (hi === -1)
        return { error: `expected a closing quote for quote at ${lo}`, input };
      return {
        result: source.substring(lo, lo + hi + 2),
        input: { ...input, span: { lo, hi: lo + hi + 2 } },
      };
    }
    return { error: `expected a string at ${lo}`, input };
  },
  expects: 'string',
});

export const literal = <T extends string>(strLiteral: T) =>
  Parser.new<T>({
    parse(input: Input) {
      const { source, span } = input;
      const lo = span.hi;
      const hi = lo + strLiteral.length;
      const result = source.substring(lo, hi) as T;
      if (result === strLiteral)
        return {
          result,
          input: { ...input, span: { lo, hi } },
        };
      return {
        error: `expected literal: ${strLiteral} at ${lo}`,
        input,
      };
    },
    expects: strLiteral,
  });

const whitespace = literal(' ').mapErr((_) => 'expected a whitespace');
const newline = literal('\n').mapErr((_) => 'expected a newline');
const tab = literal('\t').mapErr((_) => 'expected a tab');

export const space = oneOf(whitespace, newline, tab);

export const spaces = oneOrMore(space);

export const optionalSpaces = oneOf(oneOrMore(space), literal(''));