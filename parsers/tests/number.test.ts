import { describe, it, assert, assertEquals } from 'deno.tests';
import { Source } from '../../types/parser.ts';
import { number } from '../number.ts';
import { parsersTests } from './utils.ts';

const numberParser = describe(parsersTests, 'number parser');

it(numberParser, 'works for integers', () => {
  const input = Source.toDefaultInput(`0123`);
  const parsed = number.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, 123);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 4);
});

it(numberParser, 'works for  floats', () => {
  const input = { source: new Source(`aa123.90`), span: { lo: 0, hi: 2 } };
  const parsed = number.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, 123.9);
  assertEquals(parsed.span.lo, 2);
  assertEquals(parsed.span.hi, 8);
});

it(numberParser, 'fails for non-numbers', () => {
  const input = Source.toDefaultInput(`hello`);
  const parsed = number.parse(input);
  assert('error' in parsed);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 0);
});

it(numberParser, 'fails for floats started a dot', () => {
  const input = Source.toDefaultInput(`".90`);
  const parsed = number.parse(input);
  assert('error' in parsed);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 0);
});

Deno.test('works for negative numbers', () => {
  const intInput = Source.toDefaultInput(`-10`);
  const floatInput = Source.toDefaultInput(`-123.90`);
  let parsed = number.parse(intInput);
  assert('result' in parsed);
  assertEquals(parsed.result, -10);
  parsed = number.parse(floatInput);
  assert('result' in parsed);
  assertEquals(parsed.result, -123.9);
});

Deno.test('works for exponents', () => {
  const negInput = Source.toDefaultInput(`-10E-23`);
  const posInput = Source.toDefaultInput(`123e-9`);
  let parsed = number.parse(negInput);
  assert('result' in parsed);
  assertEquals(parsed.result, -10e-23);
  parsed = number.parse(posInput);
  assert('result' in parsed);
  assertEquals(parsed.result, 123e-9);
});
