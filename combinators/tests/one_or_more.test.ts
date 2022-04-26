import { combinatorsTests } from './utils.ts';
import { describe, it, assert, assertEquals } from 'deno.tests';
import { oneOrMore } from '../one_or_more.ts';
import { boolean, literal, number, string } from '~parsers/mod.ts';
import { oneOf } from '../one_of.ts';

const oneOrMoreParser = describe(combinatorsTests, 'oneOrMore');

it(oneOrMoreParser, 'single parser input', () => {
  const input = { source: `"test""mine"`, span: { lo: 0, hi: 0 } };
  const parser = oneOrMore(string);
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, [`"test"`, `"mine"`]);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 12);
});

it(oneOrMoreParser, 'fail without matches', () => {
  const input = { source: `545646`, span: { lo: 0, hi: 0 } };
  const parser = oneOrMore(string);
  const parsed = parser.parse(input);
  assert('error' in parsed);
});

it(oneOrMoreParser, 'fail when match exist but not from start', () => {
  const input = { source: `545646"mine"`, span: { lo: 0, hi: 0 } };
  const parser = oneOrMore(string);
  const parsed = parser.parse(input);
  assert('error' in parsed);
});

it(oneOrMoreParser, 'union of parsers input', () => {
  const input = { source: `456.78,false`, span: { lo: 0, hi: 0 } };
  const comma = literal(',');
  const parser = oneOrMore(oneOf(string, number, boolean, comma));
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, [456.78, ',', false]);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 12);

  const input1 = { ...input, source: `456.78,false,"hey,llo"` };
  const parsed1 = parser.parse(input1);
  assert('result' in parsed1);
  assertEquals(parsed1.result, [456.78, ',', false, ',', `"hey,llo"`]);
  assertEquals(parsed1.input.span.lo, 0);
  assertEquals(parsed1.input.span.hi, 22);
});
