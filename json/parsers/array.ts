import { Input, JSONArray, JSONObject, Kind, Parser } from '../types/mod.ts';
import { jsonBoolean } from './boolean.ts';
import { oneOf, surroundedBy, separatedBy, inOrder } from './combinators.ts';
import { jsonNull } from './null.ts';
import { jsonNumber } from './number.ts';
import { jsonKey, jsonString, literal, optionalSpaces } from './string.ts';

export const jsonArray: Parser<JSONArray> = Parser.new<JSONArray>({
  parse(input: Input) {
    const op = literal('[');
    const cl = literal(']');
    const elements = oneOf(
      jsonNull,
      jsonBoolean,
      jsonString,
      jsonNumber,
      jsonObject,
      jsonArray
    );
    const comma = literal(',');
    const sepParser = separatedBy(
      elements,
      inOrder(optionalSpaces, comma, optionalSpaces)
    );
    return surroundedBy(op, sepParser, cl)
      .map(
        ({ result: value, input: { span } }) =>
          ({ kind: Kind.Array, value, span } as const)
      )
      .parse(input);
  },
  expects: 'array',
});

export const jsonObject: Parser<JSONObject> = Parser.new<JSONObject>({
  parse(input: Input) {
    const op = literal('{');
    const cl = literal('}');
    const key = inOrder(optionalSpaces, jsonKey, optionalSpaces).map(
      ({ result }) => result.second
    );
    const colon = literal(':');
    const elements = oneOf(
      jsonNull,
      jsonBoolean,
      jsonString,
      jsonNumber,
      jsonArray,
      jsonObject
    );
    const value = inOrder(optionalSpaces, elements, optionalSpaces).map(
      ({ result }) => result.second
    );
    const entry = inOrder(key, colon, value).map(({ result }) => ({
      key: result.first,
      value: result.third,
    }));
    const comma = literal(',');
    const sepParser = separatedBy(
      entry,
      inOrder(optionalSpaces, comma, optionalSpaces)
    );
    return surroundedBy(op, sepParser, cl)
      .map(
        ({ result: value, input: { span } }) =>
          ({ kind: Kind.Object, value, span } as const)
      )
      .parse(input);
  },
  expects: 'object',
});
