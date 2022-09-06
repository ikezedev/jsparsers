import { Parser, Input, IResult } from '~types/parser.ts';

export const oneOrMore = <T>(parser: Parser<T>): Parser<T[]> =>
  Parser.new<T[]>({
    parse(input: Input) {
      const outputs: IResult<T>[] = [];
      let nextInput = parser.parse(input);
      if ('result' in nextInput) {
        outputs.push(nextInput);
      } else {
        return nextInput;
      }

      while (
        nextInput.span.hi < nextInput.source.length &&
        !('error' in nextInput)
      ) {
        nextInput = parser.parse(nextInput);
        if ('result' in nextInput) outputs.push(nextInput);
      }
      return {
        source: input.source,
        result: outputs.map((o) => o.result),
        span: { hi: nextInput.span.hi, lo: outputs[0].span.lo },
      };
    },
    expects: parser.expects,
  });
