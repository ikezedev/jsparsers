import { assert, assertEquals, describe, it } from 'deno.tests';
import { Source } from '../../types/parser.ts';
import { boolean } from '../boolean.ts';
import { parsersTests } from './utils.ts';

const booleanParserTest = describe(parsersTests, 'boolean parser');

it(booleanParserTest, 'works for false', () => {
  const input = Source.toDefaultInput(`false`);
  const parsed = boolean.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, false);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 5);
});

it(booleanParserTest, 'works for true', () => {
  const input = Source.toDefaultInput(`true`);
  const parsed = boolean.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, true);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 4);
});

it(booleanParserTest, 'fails for non-boolean', () => {
  const input = Source.toDefaultInput(`undefined`);
  const parsed = boolean.parse(input);
  assert('error' in parsed);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 0);
  assertEquals(parsed.error, 'expected a boolean');

  const input1 = Source.toDefaultInput(``);
  const parsed1 = boolean.parse(input1);
  assert('error' in parsed1);
});
