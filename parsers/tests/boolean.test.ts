import { assert, assertEquals, describe, it } from 'deno.tests';
import { boolean } from '../boolean.ts';
import { parsersTests } from './utils.ts';

const booleanParserTest = describe(parsersTests, 'boolean parser');

it(booleanParserTest, 'works for false', () => {
  const input = { source: `false`, span: { lo: 0, hi: 0 } };
  const parsed = boolean.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, false);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 5);
});

it(booleanParserTest, 'works for true', () => {
  const input = { source: `true`, span: { lo: 0, hi: 0 } };
  const parsed = boolean.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, true);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 4);
});

it(booleanParserTest, 'fails for non-boolean', () => {
  const input = { source: `undefined`, span: { lo: 0, hi: 0 } };
  const parsed = boolean.parse(input);
  assert('error' in parsed);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 0);
  assertEquals(parsed.error, 'expected a boolean');

  const input1 = { ...input, source: '' };
  const parsed1 = boolean.parse(input1);
  assert('error' in parsed1);
});
