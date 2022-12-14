import { Parser, Input, ParseError } from '~types/parser.ts';

export const literal = <T extends string | TemplateStringsArray>(
  strLiteral: T
) =>
  Parser.new<string>({
    parse(input: Input) {
      const { source, span } = input;
      const lo = span.hi;
      const hi = lo + strLiteral.toString().length;
      const result = source.substring(lo, hi) as T;
      if (result === strLiteral.toString())
        return {
          result,
          source: input.source,
          span: { lo, hi },
        };
      return ParseError.fromInput(
        input,
        `expected literal: ${strLiteral.toString()} from ${lo} to ${hi}, got ${result}`
      );
    },
    expects: strLiteral.toString(),
  });
