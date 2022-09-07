import { Parser, Input, ParseError } from '~types/parser.ts';

export const takeUntil = <T, U>(
  parser: Parser<T>,
  until: Parser<U> | ((i: Input) => boolean)
) =>
  Parser.new({
    parse(input: Input) {
      let nextInput = input;
      const result: T[] = [];
      const checkFn = (i: Input) =>
        'parse' in until ? 'result' in until.parse(i) : until(i);

      while (!checkFn(nextInput)) {
        const current = parser.parse(nextInput);
        if ('result' in current) {
          result.push(current.result);
          nextInput = current;
        } else {
          if (result.length)
            return {
              result,
              source: nextInput.source,
              span: { hi: nextInput.span.hi, lo: input.span.hi },
            };
          return current;
        }
      }
      if (result.length)
        return {
          result,
          source: nextInput.source,
          span: { hi: nextInput.span.hi, lo: input.span.hi },
        };
      return ParseError.fromInput(input, `unexpected token`);
    },
    expects: parser.expects,
  });
