import { Parser } from '~types/parser.ts';
import { inOrder, oneOf, oneOrMore } from '~combinators/mod.ts';
import { literal as lit } from './string.ts';

export const number: Parser<number> = (() => {
  const digit = oneOrMore(oneOf(...[...'0123456789'].map(lit))).mapResult((r) =>
    r.join('')
  );
  const fraction = inOrder(digit, lit('.'), digit).mapResult(String);

  const eSign = inOrder(
    oneOf(lit('E'), lit('e')),
    oneOf(lit('-'), lit('+'))
  ).mapResult(String);

  const exponent = inOrder(oneOf(fraction, digit), eSign, digit).mapResult(
    String
  );

  return inOrder(oneOf(lit('-'), lit('')), oneOf(exponent, fraction, digit))
    .mapResult(String)
    .mapResult(parseFloat)
    .setExpects('number');
})();
