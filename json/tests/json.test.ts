import { Json, processJSONValue } from '../mod.ts';

Deno.test('json test', () => {
  const input = '{"name": "ike", "age": 27, "array": []}';
  const output = Json.parse(input);
  console.log(output);
  if ('result' in output) {
    // console.log(JSON.stringify(output.result));
    console.log(processJSONValue(output.result));
  }
});

Deno.test('json test', () => {
  const input = '{"name": "ike", "age": 27, "empty": {}}';
  const output = Json.parse(input);
  console.log(output);
  if ('result' in output) {
    console.log(JSON.stringify(output.result));
    console.log(processJSONValue(output.result));
  }
});
