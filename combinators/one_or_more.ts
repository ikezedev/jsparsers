import { Parser, Input, IResult } from '~types/parser.ts';

export const oneOrMore = <T>(parser: Parser<T>): Parser<T[]> =>
  Parser.new<T[]>({
    parse(input: Input) {
      const outputs: IResult<T>[] = [];
      let lastOutput = parser.parse(input);
      if ('result' in lastOutput) outputs.push(lastOutput);
      let nextInput = lastOutput.input;
      while (
        nextInput.span.hi < nextInput.source.length &&
        !('error' in lastOutput)
      ) {
        lastOutput = parser.parse(nextInput);
        if ('result' in lastOutput) outputs.push(lastOutput);
        nextInput = lastOutput.input;
      }
      if (!outputs.length) {
        return {
          input,
          error: `Expected at least one ${parser.expects}`,
        };
      }
      return {
        result: outputs.map((o) => o.result),
        input: {
          ...nextInput,
          span: { ...nextInput.span, lo: outputs[0].input.span.lo },
        },
      };
    },
    expects: parser.expects,
  });
