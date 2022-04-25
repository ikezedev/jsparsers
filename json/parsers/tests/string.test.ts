import { describe, it, assert, assertEquals } from 'deno.tests';
import { literal, string } from '../string.ts';

const stringParser = describe('string parser');

it(stringParser, 'parser works', () => {
  const input = { source: `"test"`, span: { lo: 0, hi: 0 } };
  const parsed = string.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, `"test"`);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 6);
});

it(stringParser, 'fails for non-strings', () => {
  const input = { source: `1`, span: { lo: 0, hi: 0 } };
  const parsed = string.parse(input);
  assert('error' in parsed);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 0);
});

it(stringParser, 'fails for non-terminated strings', () => {
  const input = { source: `"test`, span: { lo: 0, hi: 0 } };
  const parsed = string.parse(input);
  assert('error' in parsed);
  assertEquals(parsed.error, 'expected a closing "');
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 0);
});

const literalParser = describe('literal parser');

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
  assertEquals(parsed.error, `expected literal: 124`);
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
