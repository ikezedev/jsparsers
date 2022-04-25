import { Input, JSONString, JSONKey, Kind, Parser } from '../types/mod.ts';
import { oneOf, oneOrMore } from './combinators.ts';

export const string = Parser.new<string>({
  parse(input: Input) {
    const { source, span } = input;
    const lo = span.hi;
    if (source[lo] === '"') {
      const hi = source.substring(lo + 1).indexOf('"');
      if (hi === -1) return { error: 'expected a closing "', input };
      return {
        result: source.substring(lo, lo + hi + 2),
        input: { ...input, span: { lo, hi: lo + hi + 2 } },
      };
    }
    return { error: 'expected a string', input };
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
        error: `expected literal: ${strLiteral}`,
        input,
      };
    },
    expects: strLiteral,
  });

export const jsonString: Parser<JSONString> = string.map(
  ({ result: value, input: { span } }) => ({
    kind: Kind.String,
    value: value.slice(1, -1),
    span,
  })
);

export const jsonKey: Parser<JSONKey> = jsonString.map(
  ({ result: { kind: _, ...rest } }) => ({
    ...rest,
    type: 'key',
  })
);

const whitespace = literal(' ').mapErr((_) => 'expected a whitespace');
const newline = literal('\n').mapErr((_) => 'expected a newline');
const tab = literal('\t').mapErr((_) => 'expected a tab');

export const space = oneOf(whitespace, newline, tab);

export const spaces = oneOrMore(space);

export const optionalSpaces = oneOf(oneOrMore(space), literal(''));
