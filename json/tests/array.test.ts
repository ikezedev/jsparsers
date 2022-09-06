import { assert, assertEquals, describe, it } from 'deno.tests';
import { Source } from '../../types/parser.ts';
import { jsonArray, processJSONValue } from '../json.ts';
import { jsonTest } from './test_util.ts';

const jsonArrayParser = describe(jsonTest, 'array parser');

it(jsonArrayParser, 'simple elements', () => {
  const input = Source.toDefaultInput(`[false, "mine", 34, 78.90]`);
  const parsed = jsonArray.parse(input);
  assert('result' in parsed);
  assertEquals(processJSONValue(parsed.result), [false, 'mine', 34, 78.9]);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 26);
});

it(jsonArrayParser, 'nested simple elements', () => {
  const input = Source.toDefaultInput(
    `[false, "mine", 34, 78.90, [1, "ring", true]]`
  );
  const parsed = jsonArray.parse(input);
  assert('result' in parsed);
  assertEquals(processJSONValue(parsed.result), [
    false,
    'mine',
    34,
    78.9,
    [1, 'ring', true],
  ]);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 45);
});
