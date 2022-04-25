import { assert, assertEquals, describe, it } from 'deno.tests';
import { jsonArray } from '../array.ts';
import { processJSONValue } from '../utils.ts';

const jsonArrayParser = describe('boolean parser');

it(jsonArrayParser, 'simple elements', () => {
  const input = {
    source: `[false, "mine", 34, 78.90]`,
    span: { lo: 0, hi: 0 },
  };
  const parsed = jsonArray.parse(input);
  assert('result' in parsed);
  assertEquals(processJSONValue(parsed.result), [false, 'mine', 34, 78.9]);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 26);
});

it(jsonArrayParser, 'nested simple elements', () => {
  const input = {
    source: `[false, "mine", 34, 78.90, [1, "ring", true]]`,
    span: { lo: 0, hi: 0 },
  };
  const parsed = jsonArray.parse(input);
  assert('result' in parsed);
  assertEquals(processJSONValue(parsed.result), [
    false,
    'mine',
    34,
    78.9,
    [1, 'ring', true],
  ]);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 45);
});
