import { Json } from '../mod.ts';

Deno.test('json test', () => {
  const input = '{"name": "ike", "age": 27, "array": []}';
  const output = Json.parse(input);
  console.log(output);
});

Deno.test('json test', () => {
  const input = '{"name": "ike", "age": 27, "empty": {}}';
  const output = Json.parse(input);
  console.log(output);
});
