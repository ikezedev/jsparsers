import { Json as JSON } from '../mod.ts';

Deno.test('json test', () => {
  const input =
    '{"name": "ike", "age": 27, "array": ["me", 4, [1, 2, 3, {"name": 123}]]}';
  JSON.parse(input);
});

Deno.test('json test1', () => {
  const input = '{"name": "ike", "age": 27, "empty": {}}';
  JSON.parse(input, (key, value) => {
    // log the current property name, the last is "".
    return value; // return the unchanged property value.
  });
  JSON.parse('{"1": 1, "2": 2, "3": {"4":4}}', (key, value) => {
    // log the current property name, the last is "".
    return value; // return the unchanged property value.
  });
});
