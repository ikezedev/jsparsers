import { combinatorsTests } from './utils.ts';
import { describe, it, assert, assertEquals } from 'deno.tests';
import { oneOrMore } from '../one_or_more.ts';
import { any } from '../any.ts';
import { Source } from '../../types/parser.ts';

const anyParser = describe(combinatorsTests, 'any parser');

it(anyParser, 'basic', () => {
  const input = Source.toDefaultInput(`"test""mine"`);
  const parsed = any.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, `"`);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 1);
});

it(anyParser, 'with oneOrMore', () => {
  const input = Source.toDefaultInput(`"test""mine"`);
  const parser = oneOrMore(any);
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, [...`"test""mine"`]);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 12);
});
