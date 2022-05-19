import { assert, assertEquals, describe, it } from 'deno.tests';
// import { Json as JSON } from '../mod.ts';
import { jsonParser, processJSONValue } from '../json.ts';
import { Kind, visit } from '../ast.ts';
import { jsonTest } from './test_util.ts';

const jsonParserTest = describe(jsonTest, 'json parser');

Deno.test('simple elements', () => {
  const input = {
    source: `{"name": "ike", "age": 3, "friend": "Tunde"}`,
    span: { lo: 0, hi: 0 },
  };
  const parsed = jsonParser.parse(input);
  assert('result' in parsed);
  const test = visit(parsed.result, {});
  assertEquals(parsed.result, test);

  console.log(JSON.stringify(parsed, null, 2));

  const test2 = visit(parsed.result, {
    JSONString(node) {
      node.value;
      return {
        kind: Kind.JSONArray,
        value: [node],
        span: node.span,
      };
    },
    JSONArray(node) {
      node.value;
    },
  });
  console.log(JSON.stringify(test2, null, 2));
  assertEquals(processJSONValue(test2), {
    name: ['ike'],
    age: 3,
    friend: ['Tunde'],
  });
  // assertEquals(parsed.input.span.hi, 25);
});

it(jsonParserTest, 'nested simple elements', () => {
  const input = {
    source: `{"name": "ike", "age": 3, "info": {"city": "Oslo", "poBox": 0151}}`,
    span: { lo: 0, hi: 0 },
  };
  const parsed = jsonParser.parse(input);
  // console.log({ parsed });
  // assert('result' in parsed);
  // assertEquals(processJSONValue(parsed.result), {
  //   name: 'ike',
  //   age: 3,
  //   info: { city: 'Oslo', poBox: 151 },
  // });
  // assertEquals(parsed.input.span.lo, 0);
  // assertEquals(parsed.input.span.hi, 66);
});

it(jsonParserTest, 'nested simple elements 2', () => {
  const input = {
    source: `{"1": 1, "2": 2, "3": { "4": 4 } }`,
    span: { lo: 0, hi: 0 },
  };
  const parsed = jsonParser.parse(input);
  // console.log({ parsed });
  // assert('result' in parsed);
  // assertEquals(processJSONValue(parsed.result), {
  //   '1': 1,
  //   '2': 2,
  //   '3': { '4': 4 },
  // });
});
