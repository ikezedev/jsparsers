import { assert, assertEquals, describe, it } from 'deno.tests';
import { string, number } from '~parsers/mod.ts';
import { oneOf } from '../mod.ts';
import { combinatorsTests } from './utils.ts';

const oneOfParser = describe(combinatorsTests, 'oneOf');

it(oneOfParser, 'works as expected', () => {
  const input = { source: `"test"`, span: { lo: 0, hi: 0 } };
  const parser = oneOf(string, number);
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assert(typeof parsed.result === 'string');
  assertEquals(parsed.result, `"test"`);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 6);

  const input1 = { source: `123`, span: { lo: 0, hi: 0 } };
  const parser1 = oneOf(string, number);
  const parsed1 = parser1.parse(input1);
  assert('result' in parsed1);
  assert(typeof parsed1.result === 'number');
  assertEquals(parsed1.result, 123);
  assertEquals(parsed1.input.span.lo, 0);
  assertEquals(parsed1.input.span.hi, 3);
});

it(oneOfParser, 'fails when non matches', () => {
  const input = { source: `null`, span: { lo: 0, hi: 0 } };
  const parser = oneOf(string, number);
  const parsed = parser.parse(input);
  assert('error' in parsed);
  assertEquals(parsed.error, `Expected one of string, number`);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 0);
});
