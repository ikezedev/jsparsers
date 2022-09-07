import { Parser, Input, ParseError } from '~types/parser.ts';

export function oneOf<T>(...parsers: Parser<T>[]): Parser<T>;
export function oneOf<T>(parsers: Parser<T>[]): Parser<T>;
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

export function oneOf(
  p1: Parser<unknown>[] | Parser<unknown>,
  ...parsers: Parser<unknown>[]
): Parser<unknown> {
  const allParsers = Array.isArray(p1) ? [...p1, ...parsers] : [p1, ...parsers];
  return Parser.new({
    parse(input: Input) {
      for (const parser of allParsers) {
        const output = parser.parse(input);
        if ('result' in output) return output;
      }
      return ParseError.fromInput(
        input,
        `Expected one of ${allParsers
          .map((p) => p.expects)
          .join(', ')} but got ${input.source.peekHi(input)}`
      );
    },
    expects: parsers
      .map((p) => p.expects)
      .filter(Boolean)
      .join(', '),
  });
}
