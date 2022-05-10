import {
  oneOf,
  oneOrMore,
  inOrder,
  len,
  surroundedBy,
} from '~combinators/mod.ts';
import { Parser, Input } from '~types/parser.ts';
import { any } from '../combinators/any.ts';
import { takeUntil } from '../combinators/take_until.ts';
import { literal as l } from './literal.ts';

export const string = Parser.new<string>({
  parse(input: Input) {
    const { source, span } = input;
    const lo = span.hi;
    if (source[lo] === '"') {
      const hi = source.substring(lo + 1).indexOf('"');
      if (hi === -1)
        return { error: `expected a closing quote for quote at ${lo}`, input };
      return {
        result: source.substring(lo, lo + hi + 2),
        input: { ...input, span: { lo, hi: lo + hi + 2 } },
      };
    }
    return { error: `expected a string at ${lo}`, input };
  },
  expects: 'string',
});

export const space = oneOf(l(' '), l('\n'), l('\t'), l('\r'));

export const whitespaces = oneOrMore(space);

export const optionalWhitespaces = oneOf(whitespaces, l(''));

const join = (arr: string[] | readonly string[]) => arr.join('');

export const stringNew = (() => {
  const controls = oneOf(l`\n`, l`\b`, l`\f`, l`\r`, l`\t`, l`\\`, l`"`);
  const escapedControls = oneOf(
    l('\\n').mapResult(() => '\n'),
    l('\\"').mapResult(() => '"'),
    l('\\/').mapResult(() => '/'),
    l('\\b').mapResult(() => '\b'),
    l('\\f').mapResult(() => '\f'),
    l('\\r').mapResult(() => '\r'),
    l('\\t').mapResult(() => '\t')
  );
  //
  const hex = oneOf(...'ABCDEFabcdef0123456789'.split('').map(l));
  const unicode = inOrder(l`\\`, l`u`, len(hex, 4).mapResult(join)).mapResult(
    ({ third: c }) => String.fromCharCode(parseInt(c, 16))
  );

  const rSolidus = l`\\\\`.mapResult((s) => s[0]);

  const anyChar = takeUntil(any, controls).mapResult(join);

  const validSequence = oneOf(rSolidus, escapedControls, unicode, anyChar);
  return surroundedBy(
    l`"`,
    oneOf(oneOrMore(validSequence).mapResult(join), l``),
    l`"`
  );
})();
