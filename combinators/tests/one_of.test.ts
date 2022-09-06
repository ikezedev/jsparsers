import { assert, assertEquals } from 'deno.tests';
import { string, number, literal as l } from '~parsers/mod.ts';
import { Source } from '~types/parser.ts';
import { oneOf } from '~combinators/mod.ts';

Deno.test('string', () => {
  const input = { source: new Source(`"test"`), span: { lo: 0, hi: 0 } };
  const parser = oneOf(string, number);
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assert(typeof parsed.result === 'string');
  assertEquals(parsed.result, `"test"`);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 6);
});

Deno.test('number', () => {
  const input1 = { source: new Source(`123`), span: { lo: 0, hi: 0 } };
  const parser1 = oneOf(string, number);
  const parsed1 = parser1.parse(input1);
  assert('result' in parsed1);
  assert(typeof parsed1.result === 'number');
  assertEquals(parsed1.result, 123);
  assertEquals(parsed1.span.lo, 0);
  assertEquals(parsed1.span.hi, 3);
});

Deno.test('fails when non matches', () => {
  const input = { source: new Source(`null`), span: { lo: 0, hi: 0 } };
  const parser = oneOf(string, number);
  const parsed = parser.parse(input);
  assert('error' in parsed);
  assertEquals(parsed.error, `Expected one of string, number but got n`);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 0);
});

Deno.test('literal', () => {
  const input = { source: new Source(`14`), span: { lo: 0, hi: 0 } };
  const parser = oneOf(l`1`, l`.`);
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, '1');
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 1);
});
