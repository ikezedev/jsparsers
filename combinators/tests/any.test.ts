import { combinatorsTests } from './utils.ts';
import { describe, it, assert, assertEquals } from 'deno.tests';
import { oneOrMore } from '../one_or_more.ts';
import { any } from '../any.ts';

const anyParser = describe(combinatorsTests, 'any parser');

it(anyParser, 'basic', () => {
  const input = { source: `"test""mine"`, span: { lo: 0, hi: 0 } };
  const parsed = any.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, `"`);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 1);
});

it(anyParser, 'with oneOrMore', () => {
  const input = { source: `"test""mine"`, span: { lo: 0, hi: 0 } };
  const parser = oneOrMore(any);
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, [...`"test""mine"`]);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 12);
});
