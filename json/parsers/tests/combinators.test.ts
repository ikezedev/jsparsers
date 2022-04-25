import { assert, assertEquals, describe, it } from 'deno.tests';
import { boolean } from '../boolean.ts';
import { oneOf, oneOrMore, separatedBy, surroundedBy } from '../combinators.ts';
import { number } from '../number.ts';
import { literal, string } from '../string.ts';

const combinators = describe('combinators');

const oneOfParser = describe(combinators, 'oneOf');

it(oneOfParser, 'works as expected', () => {
  const input = { source: `"test"`, span: { lo: 0, hi: 0 } };
  const parser = oneOf(string, number);
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assert(typeof parsed.result === 'string');
  assertEquals(parsed.result, `"test"`);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 6);

  const input1 = { source: `123`, span: { lo: 0, hi: 0 } };
  const parser1 = oneOf(string, number);
  const parsed1 = parser1.parse(input1);
  assert('result' in parsed1);
  assert(typeof parsed1.result === 'number');
  assertEquals(parsed1.result, 123);
  assertEquals(parsed1.input.span.lo, 0);
  assertEquals(parsed1.input.span.hi, 3);
});

it(oneOfParser, 'fails when non matches', () => {
  const input = { source: `null`, span: { lo: 0, hi: 0 } };
  const parser = oneOf(string, number);
  const parsed = parser.parse(input);
  assert('error' in parsed);
  assertEquals(parsed.error, `Expected one of string, number`);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 0);
});

const oneOrMoreParser = describe(combinators, 'oneOrMore');

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

// separated by
const separatedByParser = describe('separatedBy');

it(separatedByParser, 'separated by', () => {
  const input = {
    source: `456.78,false,"hey,llo",true`,
    span: { lo: 0, hi: 0 },
  };
  const comma = literal(',');
  const main = oneOf(boolean, string, number);
  const parser = separatedBy(main, comma);
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, [456.78, false, `"hey,llo"`, true]);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 27);
});

it(separatedByParser, 'separatedBy trailing', () => {
  const input = {
    source: `456.78,false,"hey,llo",true,`,
    span: { lo: 0, hi: 0 },
  };
  const comma = literal(',');
  const main = oneOf(string, number, boolean);
  const parser = separatedBy(main, comma, true);
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, [456.78, false, `"hey,llo"`, true]);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 28);
});

it(separatedByParser, 'does not match multiple separators', () => {
  const input = {
    source: `456.78,false,,"hey,llo",true,`,
    span: { lo: 0, hi: 0 },
  };
  const comma = literal(',');
  const main = oneOf(string, number, boolean);
  const parser = separatedBy(main, comma, true);
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, [456.78, false]);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 13);
});

const surroundedByParser = describe('surroundedBy');

it(surroundedByParser, 'surrounded by', () => {
  const input = {
    source: `(456.78,false,"hey,llo",true)`,
    span: { lo: 0, hi: 0 },
  };

  const comma = literal(',');
  const open = literal('(');
  const close = literal(')');

  const p1 = oneOf(boolean, string, number);
  const p2 = separatedBy(p1, comma);

  const parser = surroundedBy(open, p2, close);
  const parsed = parser.parse(input);

  assert('result' in parsed);
  assertEquals(parsed.result, [456.78, false, `"hey,llo"`, true]);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 29);
});

it(surroundedByParser, 'ignore unmatched separator', () => {
  const input = {
    source: `(456.78,false,"hey,llo",true))`,
    span: { lo: 0, hi: 0 },
  };

  const comma = literal(',');
  const open = literal('(');
  const close = literal(')');

  const p1 = oneOf(boolean, string, number);
  const p2 = separatedBy(p1, comma);

  const parser = surroundedBy(open, p2, close);
  const parsed = parser.parse(input);

  assert('result' in parsed);
  assertEquals(parsed.result, [456.78, false, `"hey,llo"`, true]);
  assertEquals(parsed.input.span.lo, 0);
  assertEquals(parsed.input.span.hi, 29);
});

it(surroundedByParser, 'fails multiple opening matches', () => {
  const input = {
    source: `((456.78,false,"hey,llo",true)`,
    span: { lo: 0, hi: 0 },
  };

  const comma = literal(',');
  const open = literal('(');
  const close = literal(')');

  const p1 = oneOf(boolean, string, number);
  const p2 = separatedBy(p1, comma);

  const parser = surroundedBy(open, p2, close);
  const parsed = parser.parse(input);

  assert('error' in parsed);
});
