import { combinatorsTests } from './utils.ts';
import { describe, it, assert, assertEquals } from 'deno.tests';
import { literal as l } from '~parsers/mod.ts';
import { takeUntil } from '../take_until.ts';
import { any } from '../any.ts';
import { Source } from '../../types/parser.ts';

const takeUntilParser = describe(combinatorsTests, 'takeUntil');

it(takeUntilParser, 'single parser input', () => {
  const input = Source.toDefaultInput(`lllljjjjj`);
  const parser = takeUntil(l`l`, (i) => i.source.peek(i.span.hi) === 'j');
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, [...`llll`]);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 4);
});

it(takeUntilParser, 'with a parser', () => {
  const input = Source.toDefaultInput(`lllljjjjj`);
  const parser = takeUntil(l`l`, l`j`);
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, [...`llll`]);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 4);
});

it(takeUntilParser, 'with any', () => {
  const input = Source.toDefaultInput(`lllljjjjj`);
  const parser = takeUntil(any, l`j`).mapResult((r) => r.join(''));
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, `llll`);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 4);
});
