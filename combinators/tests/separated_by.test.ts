import { combinatorsTests } from './utils.ts';
import { describe, it, assert, assertEquals } from 'deno.tests';
import { boolean, literal, number, string } from '~parsers/mod.ts';
import { oneOf } from '../one_of.ts';
import { separatedBy } from '../separated_by.ts';
import { Source } from '../../types/parser.ts';

const separatedByParser = describe(combinatorsTests, 'separatedBy');

it(separatedByParser, 'separated by', () => {
  const input = Source.toDefaultInput(`456.78,false,"hey,llo",true`);
  const comma = literal(',');
  const main = oneOf(boolean, string, number);
  const parser = separatedBy(main, comma);
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, [456.78, false, `"hey,llo"`, true]);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 27);
});

it(separatedByParser, 'separatedBy trailing', () => {
  const input = Source.toDefaultInput(`456.78,false,"hey,llo",true,`);
  const comma = literal(',');
  const main = oneOf(string, number, boolean);
  const parser = separatedBy(main, comma, true);
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, [456.78, false, `"hey,llo"`, true]);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 28);
});

it(separatedByParser, 'does not match multiple separators', () => {
  const input = Source.toDefaultInput(`456.78,false,,"hey,llo",true,`);
  const comma = literal(',');
  const main = oneOf(string, number, boolean);
  const parser = separatedBy(main, comma, true);
  const parsed = parser.parse(input);
  assert('result' in parsed);
  assertEquals(parsed.result, [456.78, false]);
  assertEquals(parsed.span.lo, 0);
  assertEquals(parsed.span.hi, 13);
});
