import { Input, Parser } from '~types/parser.ts';

export const number = Parser.new<number>({
  parse(input: Input) {
    const { source, span } = input;
    const lo = span.hi;
    const match = /^\d+[.]?\d*/.exec(source.substring(lo))?.[0];
    if (match)
      return {
        result: match.includes('.') ? parseFloat(match) : parseInt(match),
        input: {
          ...input,
          span: { lo, hi: lo + match.length },
        },
      };
    return { error: `expected a number at ${lo}`, input };
  },
  expects: 'number',
});
