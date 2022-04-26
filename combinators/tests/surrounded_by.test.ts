import { combinatorsTests } from './utils.ts';
import { describe, it, assert, assertEquals } from 'deno.tests';
import { boolean, literal, number, string } from '~parsers/mod.ts';
import { oneOf } from '../one_of.ts';
import { separatedBy } from '../separated_by.ts';
import { surroundedBy } from '../surrounded_by.ts';

const surroundedByParser = describe(combinatorsTests, 'surroundedBy');

it(surroundedByParser, 'surrounded by', () => {
  const input = {
    source: `(456.78,false,"hey,llo",true)`,
    span: { lo: 0, hi: 0 },
  };

  const comma = literal(',');
  const open = literal('(');
  const close = literal(')');

  const p1 = oneOf(boolean, string, number);
  const p2 = separatedBy(p1, comma);

  const parser = surroundedBy(open, p2, close);
  const parsed = parser.parse(input);

  assert('result' in parsed);
  assertEquals(parsed.result, [456.78, false, `"hey,llo"`, true]);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 29);
});

it(surroundedByParser, 'ignore unmatched separator', () => {
  const input = {
    source: `(456.78,false,"hey,llo",true))`,
    span: { lo: 0, hi: 0 },
  };

  const comma = literal(',');
  const open = literal('(');
  const close = literal(')');

  const p1 = oneOf(boolean, string, number);
  const p2 = separatedBy(p1, comma);

  const parser = surroundedBy(open, p2, close);
  const parsed = parser.parse(input);

  assert('result' in parsed);
  assertEquals(parsed.result, [456.78, false, `"hey,llo"`, true]);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 29);
});

it(surroundedByParser, 'fails multiple opening matches', () => {
  const input = {
    source: `((456.78,false,"hey,llo",true)`,
    span: { lo: 0, hi: 0 },
  };

  const comma = literal(',');
  const open = literal('(');
  const close = literal(')');

  const p1 = oneOf(boolean, string, number);
  const p2 = separatedBy(p1, comma);

  const parser = surroundedBy(open, p2, close);
  const parsed = parser.parse(input);

  assert('error' in parsed);
});
