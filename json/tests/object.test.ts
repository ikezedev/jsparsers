import { assert, assertEquals, describe, it } from 'deno.tests';
import { Source } from '../../types/parser.ts';
import { jsonObject, processJSONValue } from '../json.ts';
import { jsonTest } from './test_util.ts';

const objectArrayParser = describe(jsonTest, 'object parser');

it(objectArrayParser, 'simple elements', () => {
  const input = Source.toDefaultInput(`{"name": "ike", "age": 3}`);
  const parsed = jsonObject.parse(input);
  assert('result' in parsed);
  assertEquals(processJSONValue(parsed.result), { name: 'ike', age: 3 });
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 25);
});

it(objectArrayParser, 'nested simple elements', () => {
  const input = Source.toDefaultInput(
    `{"name": "ike", "age": 3, "info": {"city": "Oslo", "poBox": 0151}}`
  );
  const parsed = jsonObject.parse(input);
  assert('result' in parsed);
  assertEquals(processJSONValue(parsed.result), {
    name: 'ike',
    age: 3,
    info: { city: 'Oslo', poBox: 151 },
  });
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 66);
});

it(objectArrayParser, 'nested simple elements 2', () => {
  const input = Source.toDefaultInput(`{"1": 1, "2": 2, "3": { "4": 4 } }`);
  const parsed = jsonObject.parse(input);
  assert('result' in parsed);
  assertEquals(processJSONValue(parsed.result), {
    '1': 1,
    '2': 2,
    '3': { '4': 4 },
  });
});
