import { Parser, Input, ParseError } from '~types/parser.ts';

export const any = Parser.new<string>({
  parse(input: Input) {
    const { source, span } = input;
    if (span.hi + 1 > source.length) {
      return ParseError.fromInput(input, 'unexpected end of input');
    }
    return {
      result: input.source.substring(span.hi, span.hi + 1),
      span: { lo: span.hi, hi: span.hi + 1 },
      source,
    };
  },
  expects: 'valid string',
});
