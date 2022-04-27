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

Deno.test('works for negative numbers', () => {
  const intInput = { source: `-10`, span: { lo: 0, hi: 0 } };
  const floatInput = { source: `-123.90`, span: { lo: 0, hi: 0 } };
  let parsed = number.parse(intInput);
  assert('result' in parsed);
  assertEquals(parsed.result, -10);
  parsed = number.parse(floatInput);
  assert('result' in parsed);
  assertEquals(parsed.result, -123.9);
});

Deno.test('works for exponents', () => {
  const negInput = { source: `-10E-23`, span: { lo: 0, hi: 0 } };
  const posInput = { source: `123e-9`, span: { lo: 0, hi: 0 } };
  let parsed = number.parse(negInput);
  assert('result' in parsed);
  assertEquals(parsed.result, -10e-23);
  parsed = number.parse(posInput);
  assert('result' in parsed);
  assertEquals(parsed.result, 123e-9);
});
