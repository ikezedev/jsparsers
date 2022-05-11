import {
  describe,
  it,
  assert,
  assertEquals,
  assertStringIncludes,
} from 'deno.tests';
import { string, stringNew } from '../string.ts';
import { parsersTests } from './utils.ts';

const stringParser = describe(parsersTests, 'string parser');

it(stringParser, 'parser works', () => {
  const input = { source: `"test"`, span: { lo: 0, hi: 0 } };
  const parsed = string.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, `"test"`);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 6);
});

it(stringParser, 'fails for non-strings', () => {
  const input = { source: `1`, span: { lo: 0, hi: 0 } };
  const parsed = string.parse(input);
  assert('error' in parsed);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 0);
});

it(stringParser, 'fails for non-terminated strings', () => {
  const input = { source: `"test`, span: { lo: 0, hi: 0 } };
  const parsed = string.parse(input);
  assert('error' in parsed);
  assertStringIncludes(parsed.error, 'expected a closing quote');
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 0);
});

// const newStringParser = describe('spec compatible string parser');

Deno.test('works for basic string', () => {
  const input = { source: `test`, span: { lo: 0, hi: 0 } };
  const valid = [`""`, `"\\\\"`, `"\\\\\"`, `"\\\\\\\\"`, `"\\\\me"`];
  const expected = [``, `\\`, `\\`, `\\\\`, `\\me`];
  const invalid = [`"\\"`, `"\\\\\\"`, `"\\\\\\\"`];

  for (const [i, source] of valid.entries()) {
    const parsed = stringNew.parse({ ...input, source });
    assert(
      'result' in parsed,
      `[${i}] got: ${JSON.stringify(parsed, null, 2)}`
    );
    assertEquals(parsed.result, expected[i]);
  }

  for (const source of invalid) {
    const parsed = stringNew.parse({ ...input, source });
    assert('error' in parsed);
  }
});

Deno.test('control characters', () => {
  const input = { source: ``, span: { lo: 0, hi: 0 } };
  const valid = [`"\\n"`, `"\\\\n"`, `"\\\\\\n"`, `"\\""`];
  const expected = [`\n`, `\\n`, `\\\n`, `"`];
  const invalid = [`"\n"`, `"\\\n"`, `"\\\\\n"`, `"\\j"`];

  for (const [i, source] of valid.entries()) {
    const parsed = stringNew.parse({ ...input, source });
    assert(
      'result' in parsed,
      `[${i}] got: ${JSON.stringify(parsed, null, 2)}`
    );
    assertEquals(parsed.result, expected[i]);
  }

  for (const [i, source] of invalid.entries()) {
    const parsed = stringNew.parse({ ...input, source });
    assert('error' in parsed, `${i} failed`);
  }
});

Deno.test('unicode characters', () => {
  const input = { source: ``, span: { lo: 0, hi: 0 } };
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
    const parsed = stringNew.parse({ ...input, source });
    assert(
      'result' in parsed,
      `[${i}] got: ${JSON.stringify(parsed, null, 2)}`
    );
    assertEquals(parsed.result, expected[i]);
  }

  for (const [i, source] of invalid.entries()) {
    const parsed = stringNew.parse({ ...input, source });
    assert('error' in parsed, `${i} failed`);
  }
});
