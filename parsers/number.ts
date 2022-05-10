import { Parser } from '~types/parser.ts';
import { inOrder, oneOf, oneOrMore } from '~combinators/mod.ts';
import { literal as l } from './literal.ts';

export const number: Parser<number> = (() => {
  const digit = oneOrMore(oneOf(...[...'0123456789'].map(l))).mapResult((r) =>
    r.join('')
  );
  const fraction = inOrder(digit, l`.`, digit).mapResult(String);

  const eSign = inOrder(oneOf(l`E`, l`e`), oneOf(l`-`, l`+`)).mapResult(String);

  const exponent = inOrder(oneOf(fraction, digit), eSign, digit).mapResult(
    String
  );

  return inOrder(oneOf(l`-`, l``), oneOf(exponent, fraction, digit))
    .mapResult(String)
    .mapResult(parseFloat)
    .setExpects('number');
})();
