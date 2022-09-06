import { combinatorsTests } from './utils.ts';
import { describe, it, assert, assertEquals } from 'deno.tests';
import { oneOrMore } from '../one_or_more.ts';
import { boolean, literal, number, string } from '~parsers/mod.ts';
import { oneOf } from '../one_of.ts';
import { Source } from '../../types/parser.ts';

const oneOrMoreParser = describe(combinatorsTests, 'oneOrMore');

it(oneOrMoreParser, 'single parser input', () => {
  const input = Source.toDefaultInput(`"test""mine"`);
  const parser = oneOrMore(string);
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, [`"test"`, `"mine"`]);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 12);
});

it(oneOrMoreParser, 'literals', () => {
  const input = Source.toDefaultInput(`lllljjjj`);
  const parser = oneOrMore(literal`l`).mapResult((r) => r.join(''));
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, 'llll');
});

it(oneOrMoreParser, 'fail without matches', () => {
  const input = Source.toDefaultInput(`545646`);
  const parser = oneOrMore(string);
  const parsed = parser.parse(input);
  assert('error' in parsed);
});

it(oneOrMoreParser, 'fail when match exist but not from start', () => {
  const input = Source.toDefaultInput(`545646"mine"`);
  const parser = oneOrMore(string);
  const parsed = parser.parse(input);
  assert('error' in parsed);
});

it(oneOrMoreParser, 'union of parsers input', () => {
  const input = Source.toDefaultInput(`456.78,false`);
  const comma = literal(',');
  const parser = oneOrMore(oneOf(string, number, boolean, comma));
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, [456.78, ',', false]);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 12);

  const input1 = Source.toDefaultInput(`456.78,false,"hey,llo"`);
  const parsed1 = parser.parse(input1);
  assert('result' in parsed1);
  assertEquals(parsed1.result, [456.78, ',', false, ',', `"hey,llo"`]);
  assertEquals(parsed1.span.lo, 0);
  assertEquals(parsed1.span.hi, 22);
});
