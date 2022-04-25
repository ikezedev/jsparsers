import { Input, IResult, Pair, Parser, Triple } from '../types/mod.ts';

export function oneOf<T, U>(p1: Parser<T>, p2: Parser<U>): Parser<T | U>;
export function oneOf<T, U, V>(
  p1: Parser<T>,
  p2: Parser<U>,
  p3: Parser<V>
): Parser<T | U | V>;
export function oneOf<T, U, V, W>(
  p1: Parser<T>,
  p2: Parser<U>,
  p3: Parser<V>,
  p4: Parser<W>
): Parser<T | U | V | W>;
export function oneOf<T, U, V, W, X>(
  p1: Parser<T>,
  p2: Parser<U>,
  p3: Parser<V>,
  p4: Parser<W>,
  p5: Parser<X>
): Parser<T | U | V | W | X>;
export function oneOf<T, U, V, W, X, Y>(
  p1: Parser<T>,
  p2: Parser<U>,
  p3: Parser<V>,
  p4: Parser<W>,
  p5: Parser<X>,
  p6: Parser<Y>
): Parser<T | U | V | W | X | Y>;

export function oneOf(...parsers: Parser<unknown>[]): Parser<unknown> {
  return Parser.new({
    parse(input: Input) {
      for (const parser of parsers) {
        const output = parser.parse(input);
        if ('result' in output) return output;
      }
      return {
        input,
        error: `Expected one of ${parsers.map((p) => p.expects).join(', ')}`,
      };
    },
    expects: parsers.map((p) => p.expects).join(', '),
  });
}

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

export function inOrder<T, U>(p1: Parser<T>, p2: Parser<U>): Parser<Pair<T, U>>;
export function inOrder<T, U, V>(
  p1: Parser<T>,
  p2: Parser<U>,
  p3: Parser<V>
): Parser<Triple<T, U, V>>;

export function inOrder(
  p1: Parser<unknown>,
  p2: Parser<unknown>,
  p3?: Parser<unknown>
): Parser<Triple<unknown, unknown, unknown>> | Parser<Pair<unknown, unknown>> {
  return Parser.new({
    parse(input: Input) {
      const o1 = p1.parse(input);
      if ('error' in o1) return o1;
      const o2 = p2.parse(o1.input);
      if ('error' in o2) return o2;
      const o3 = p3?.parse(o2.input);
      if (o3 && 'error' in o3) return o3;

      if (o3)
        return {
          result: Triple.new(o1.result, o2.result, o3.result),
          input: {
            ...o3.input,
            span: { ...o3.input.span, lo: o1.input.span.lo },
          },
        };
      return {
        result: Pair.new(o1.result, o2.result),
        input: {
          ...o2.input,
          span: { ...o2.input.span, lo: o1.input.span.lo },
        },
      };
    },
    expects: `${p1.expects}, ${p2.expects}${
      p3 ? ', ' + p3.expects : ''
    } in succession`,
  });
}

export const separatedBy = <T, U>(
  parser: Parser<T>,
  separator: Parser<U>,
  allowTrailing = false
): Parser<T[]> =>
  allowTrailing
    ? oneOrMore(inOrder(parser, separator).map(({ result }) => result.first))
    : inOrder(
        parser,
        oneOrMore(inOrder(separator, parser).map(({ result }) => result.second))
      ).map(({ result }) => [result.first, ...result.second]);

export const surroundedBy = <T, U, V>(
  start: Parser<U>,
  parser: Parser<T>,
  end: Parser<V>
): Parser<T> => inOrder(start, parser, end).map(({ result }) => result.second);
