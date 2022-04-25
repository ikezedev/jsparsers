import { JSONNull, Kind, Parser } from '../types/mod.ts';
import { literal } from './string.ts';

export const nullParser = literal('null')
  .map(() => null)
  .mapErr((_) => 'expected null')
  .setExpects('null');

export const jsonNull: Parser<JSONNull> = nullParser.map(
  ({ result: value, input: { span } }) => ({
    kind: Kind.Null,
    value,
    span,
  })
);
