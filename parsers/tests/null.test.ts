import { assert, assertEquals, describe, it } from 'deno.tests';
import { nullParser } from '../null.ts';
import { parsersTests } from './utils.ts';

const nullParserTest = describe(parsersTests, 'null parser');

it(nullParserTest, 'works as expected', () => {
  const input = { source: `null`, span: { lo: 0, hi: 0 } };
  const parsed = nullParser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, null);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 4);
});

it(nullParserTest, 'fails for non-nulls', () => {
  const input = { source: `undefined`, span: { lo: 0, hi: 0 } };
  const parsed = nullParser.parse(input);
  assert('error' in parsed);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 0);
  assertEquals(parsed.error, 'expected null');

  const input1 = { ...input, source: '' };
  const parsed1 = nullParser.parse(input1);
  assert('error' in parsed1);
  assertEquals(parsed1.input.span.lo, 0);
  assertEquals(parsed1.input.span.hi, 0);
});
