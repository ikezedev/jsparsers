import {
  describe,
  it,
  assert,
  assertEquals,
  assertStringIncludes,
} from 'deno.tests';
import { Source } from '~types/parser.ts';
import { literal } from '~parsers/literal.ts';
import { parsersTests } from '~parsers/tests/utils.ts';

const literalParser = describe(parsersTests, 'literal parser');

it(literalParser, 'parser works', () => {
  const input = Source.toDefaultInput(`123`);
  const parsed = literal('123').parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, `123`);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 3);
});

it(literalParser, 'takes only what is needed', () => {
  const input = Source.toDefaultInput(`12345`);
  const parsed = literal`123`.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, `123`);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 3);
});

it.only(literalParser, 'fails for non-matching literals', () => {
  const input = Source.toDefaultInput(`123`);
  const parsed = literal('124').parse(input);
  assert('error' in parsed);
  assertStringIncludes(parsed.error, `expected literal: 124`);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 0);
});

it(literalParser, 'works for empty literal', () => {
  const input = Source.toDefaultInput(``);
  const parsed = literal('').parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, ``);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 0);
});
