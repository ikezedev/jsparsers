import { assert, assertEquals, describe, it } from 'deno.tests';
import { Source } from '../../types/parser.ts';
import { nullParser } from '../null.ts';
import { parsersTests } from './utils.ts';

const nullParserTest = describe(parsersTests, 'null parser');

it(nullParserTest, 'works as expected', () => {
  const input = Source.toDefaultInput(`null`);
  const parsed = nullParser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, null);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 4);
});

it(nullParserTest, 'fails for non-nulls', () => {
  const input = Source.toDefaultInput(`undefined`);
  const parsed = nullParser.parse(input);
  assert('error' in parsed);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 0);
  assertEquals(parsed.error, 'expected null');

  const input1 = Source.toDefaultInput(``);
  const parsed1 = nullParser.parse(input1);
  assert('error' in parsed1);
  assertEquals(parsed1.span.lo, 0);
  assertEquals(parsed1.span.hi, 0);
});
