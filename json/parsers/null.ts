import { JSONNull, Kind, Parser } from '../types/mod.ts';
import { literal } from './string.ts';

export const nullParser = literal('null').biMap({
  map: () => null,
  mapErr: (_) => 'expected null',
});

export const jsonNull: Parser<JSONNull> = nullParser.map((result) => ({
  kind: Kind.Null,
  value: result,
}));
