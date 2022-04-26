import { combinatorsTests } from './utils.ts';
import { describe, it, assert, assertEquals } from 'deno.tests';
import { boolean, literal, number, string } from '~parsers/mod.ts';
import { oneOf } from '../one_of.ts';
import { separatedBy } from '../separated_by.ts';

const separatedByParser = describe(combinatorsTests, 'separatedBy');

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
