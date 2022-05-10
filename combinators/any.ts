import { Parser, Input } from '~types/parser.ts';

export const any = Parser.new({
  parse(input: Input) {
    const { source, span } = input;
    return {
      result: input.source.substring(span.hi, span.hi + 1),
      input: { span: { lo: span.hi, hi: span.hi + 1 }, source },
    };
  },
  expects: 'valid string',
});
