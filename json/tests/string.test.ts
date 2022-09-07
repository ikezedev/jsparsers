import {
  describe,
  it,
  assert,
  assertEquals,
  assertStringIncludes,
} from 'deno.tests';
import { Source } from '../../types/parser.ts';
import { jsonString, processJSONValue } from '../json.ts';

Deno.test('works for basic string', () => {
  const valid = [`""`, `"\\\\"`, `"\\\\\"`, `"\\\\\\\\"`, `"\\\\me"`];
  const expected = [``, `\\`, `\\`, `\\\\`, `\\me`];
  const invalid = [`"\\"`, `"\\\\\\"`, `"\\\\\\\"`];

  for (const [i, source] of valid.entries()) {
    const parsed = jsonString.parse(Source.toDefaultInput(source));
    assert(
      'result' in parsed,
      `[${i}] got: ${JSON.stringify(parsed, null, 2)}`
    );
    assertEquals(processJSONValue(parsed.result), expected[i]);
  }

  for (const source of invalid) {
    const parsed = jsonString.parse(Source.toDefaultInput(source));
    assert('error' in parsed);
  }
});

Deno.test('control characters', () => {
  const valid = [`"\\n"`, `"\\\\n"`, `"\\\\\\n"`, `"\\""`];
  const expected = [`\n`, `\\n`, `\\\n`, `"`];
  const invalid = [`"\n"`, `"\\\n"`, `"\\\\\n"`, `"\\j"`];

  for (const [i, source] of valid.entries()) {
    const parsed = jsonString.parse(Source.toDefaultInput(source));
    assert(
      'result' in parsed,
      `[${i}] got: ${JSON.stringify(parsed, null, 2)}`
    );
    assertEquals(processJSONValue(parsed.result), expected[i]);
  }

  for (const [i, source] of invalid.entries()) {
    const parsed = jsonString.parse(Source.toDefaultInput(source));
    assert('error' in parsed, `${i} failed`);
  }
});

Deno.test('unicode characters', () => {
  const valid = [
    `"\u7832"`,
    `"\\u7832"`,
    `"\u7832\uaab5"`,
    `"\\u7832\\uaab5"`,
    `"\\u7832 \\uaab5"`,
  ];
  const expected = ['砲', '砲', '砲ꪵ', '砲ꪵ', '砲 ꪵ'];
  const invalid = [`"\\u783t"`, `"\\\uffff"`];

  for (const [i, source] of valid.entries()) {
    const parsed = jsonString.parse(Source.toDefaultInput(source));
    assert(
      'result' in parsed,
      `[${i}] got: ${JSON.stringify(parsed, null, 2)}`
    );
    assertEquals(processJSONValue(parsed.result), expected[i]);
  }

  for (const [i, source] of invalid.entries()) {
    const parsed = jsonString.parse(Source.toDefaultInput(source));
    assert('error' in parsed, `${i} failed`);
  }
});
