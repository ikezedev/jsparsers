import { describe, it, assert, assertEquals } from 'deno.tests';
import { number } from '../number.ts';
import { parsersTests } from './utils.ts';

const numberParser = describe(parsersTests, 'number parser');

it(numberParser, 'works for integers', () => {
  const input = { source: `123`, span: { lo: 0, hi: 0 } };
  const parsed = number.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, 123);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 3);
});

it(numberParser, 'works for  floats', () => {
  const input = { source: `aa123.90`, span: { lo: 0, hi: 2 } };
  const parsed = number.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, 123.9);
  assertEquals(parsed.input.span.lo, 2);
  assertEquals(parsed.input.span.hi, 8);
});

it(numberParser, 'fails for non-numbers', () => {
  const input = { source: `hello`, span: { lo: 0, hi: 0 } };
  const parsed = number.parse(input);
  assert('error' in parsed);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 0);
});

it(numberParser, 'fails for floats started a dot', () => {
  const input = { source: `".90`, span: { lo: 0, hi: 0 } };
  const parsed = number.parse(input);
  assert('error' in parsed);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 0);
});
