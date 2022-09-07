import {
  describe,
  it,
  assert,
  assertEquals,
  assertStringIncludes,
} from 'deno.tests';
import { Source } from '../../types/parser.ts';
import { string } from '../string.ts';
import { parsersTests } from './utils.ts';

const stringParser = describe(parsersTests, 'string parser');

it(stringParser, 'parser works', () => {
  const input = Source.toDefaultInput(`"test"`);
  const parsed = string.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, `"test"`);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 6);
});

it(stringParser, 'fails for non-strings', () => {
  const input = Source.toDefaultInput(`1`);
  const parsed = string.parse(input);
  assert('error' in parsed);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 0);
});

it(stringParser, 'fails for non-terminated strings', () => {
  const input = Source.toDefaultInput(`"test`);
  const parsed = string.parse(input);
  assert('error' in parsed);
  assertStringIncludes(parsed.error, 'expected a closing quote');
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 0);
});
