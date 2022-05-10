import {
  describe,
  it,
  assert,
  assertEquals,
  assertStringIncludes,
} from 'deno.tests';
import { literal } from '../literal.ts';
import { parsersTests } from './utils.ts';

const literalParser = describe.ignore(parsersTests, 'literal parser');

it(literalParser, 'parser works', () => {
  const input = { source: `123`, span: { lo: 0, hi: 0 } };
  const parsed = literal('123').parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, `123`);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 3);
});

it(literalParser, 'takes only what is needed', () => {
  const input = { source: `12345`, span: { lo: 0, hi: 0 } };
  const parsed = literal('123').parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, `123`);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 3);
});

it(literalParser, 'fails for non-matching literals', () => {
  const input = { source: `123`, span: { lo: 0, hi: 0 } };
  const parsed = literal('124').parse(input);
  assert('error' in parsed);
  assertStringIncludes(parsed.error, `expected literal: 124`);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 0);
});

it(literalParser, 'works for empty literal', () => {
  const input = { source: ``, span: { lo: 0, hi: 0 } };
  const parsed = literal('').parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, ``);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 0);
});
