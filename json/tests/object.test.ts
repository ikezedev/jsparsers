import { assert, assertEquals, describe, it } from 'deno.tests';
import { jsonObject, processJSONValue } from '../json.ts';
import { jsonTest } from './test_util.ts';

const objectArrayParser = describe(jsonTest, 'boolean parser');

it(objectArrayParser, 'simple elements', () => {
  const input = {
    source: `{"name": "ike", "age": 3}`,
    span: { lo: 0, hi: 0 },
  };
  const parsed = jsonObject.parse(input);
  assert('result' in parsed);
  assertEquals(processJSONValue(parsed.result), { name: 'ike', age: 3 });
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 25);
});

it(objectArrayParser, 'nested simple elements', () => {
  const input = {
    source: `{"name": "ike", "age": 3, "info": {"city": "Oslo", "poBox": 0151}}`,
    span: { lo: 0, hi: 0 },
  };
  const parsed = jsonObject.parse(input);
  assert('result' in parsed);
  assertEquals(processJSONValue(parsed.result), {
    name: 'ike',
    age: 3,
    info: { city: 'Oslo', poBox: 151 },
  });
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 66);
});
