import { Input, JSONArray, JSONObject, Kind, Parser } from '../types/mod.ts';
import { oneOf } from './combinators.ts';
import { jsonNull } from './null.ts';
import { jsonNumber } from './number.ts';
import { jsonString } from './string.ts';

export const jsonArray: Parser<JSONArray> = Parser.new<JSONArray>({
  parse(input: Input) {
    const elemParsers = oneOf(
      jsonNull,
      jsonString,
      jsonNumber,
      jsonObject,
      jsonArray
    );
    const { source, span } = input;
    if (source[span.hi + 1] === '"') {
      const end = source.substring(span.hi + 2).indexOf('"');
      return {
        result: {
          value: source.substring(span.hi + 2, end - 1),
          kind: Kind.String,
        },
        input: { ...input, span: { lo: span.hi + 1, hi: end } },
      };
    }
    return { error: 'expected a string', input };
  },
  expects: 'string',
});

export const jsonObject: Parser<JSONObject> = {
  parse(input: Input) {
    const { source, span } = input;
    if (source[span.hi + 1] === '"') {
      const end = source.substring(span.hi + 2).indexOf('"');
      return {
        result: {
          value: source.substring(span.hi + 2, end - 1),
          kind: Kind.String,
        },
        input: { ...input, span: { lo: span.hi + 1, hi: end } },
      };
    }
    return { error: 'expected a string', input };
  },
  expects: 'string',
};
