import { Parser, Input } from '~types/parser.ts';

export const any = Parser.new<string>({
  parse(input: Input) {
    const { source, span } = input;
    if (span.hi + 1 > source.length) {
      return {
        error: 'unexpected end of input',
        input,
      };
    }
    return {
      result: input.source.substring(span.hi, span.hi + 1),
      input: { span: { lo: span.hi, hi: span.hi + 1 }, source },
    };
  },
  expects: 'valid string',
});
