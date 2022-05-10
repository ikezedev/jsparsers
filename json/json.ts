import {
  boolean,
  literal,
  nullParser,
  number,
  optionalWhitespaces as ows,
  string,
} from '~parsers/mod.ts';
import { inOrder, oneOf, separatedBy, surroundedBy } from '~combinators/mod.ts';
import {
  JSONValue,
  JSONString,
  Kind,
  JSONKey,
  JSONObject,
  JSONArray,
  JSONNumber,
  JSONNull,
  JSONBoolean,
} from './ast.ts';
import { Input, Parser } from '~types/parser.ts';

const jsonString: Parser<JSONString> = string.map(
  ({ result: value, input: { span } }) => ({
    kind: Kind.String,
    value: value.slice(1, -1),
    span,
  })
);

const jsonKey: Parser<JSONKey> = jsonString.map(
  ({ result: { kind: _, ...rest } }) => ({
    ...rest,
    type: 'key',
  })
);
const jsonNumber: Parser<JSONNumber> = number.map(
  ({ result: value, input: { span } }) => ({
    kind: Kind.Number,
    value,
    span,
  })
);

const jsonNull: Parser<JSONNull> = nullParser.map(
  ({ result: value, input: { span } }) => ({
    kind: Kind.Null,
    value,
    span,
  })
);

const jsonBoolean: Parser<JSONBoolean> = boolean.map(
  ({ result: value, input: { span } }) => ({
    kind: Kind.Boolean,
    value,
    span,
  })
);

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
    const sepParser = separatedBy(elements, inOrder(ows, comma, ows));
    const empty = surroundedBy(op, ows, cl).map(
      ({ input: { span } }) =>
        ({ kind: Kind.Array, value: [] as JSONValue[], span } as const)
    );
    const nonEmpty = surroundedBy(op, sepParser, cl).map(
      ({ result: value, input: { span } }) =>
        ({ kind: Kind.Array, value, span } as const)
    );
    return oneOf(nonEmpty, empty).parse(input);
  },
  expects: 'array',
});

export const jsonObject: Parser<JSONObject> = Parser.new<JSONObject>({
  parse(input: Input) {
    const op = literal('{');
    const cl = literal('}');
    const key = inOrder(ows, jsonKey, ows).map(({ result }) => result.second);
    const colon = literal(':');
    const elements = oneOf(
      jsonNull,
      jsonBoolean,
      jsonString,
      jsonNumber,
      jsonArray,
      jsonObject
    );
    const value = inOrder(ows, elements, ows).map(
      ({ result }) => result.second
    );
    const entry = inOrder(key, colon, value).map(({ result }) => ({
      key: result.first,
      value: result.third,
    }));
    const comma = literal(',');
    const sepParser = separatedBy(entry, inOrder(ows, comma, ows));
    const empty = surroundedBy(op, ows, cl).map(
      ({ input: { span } }) =>
        ({ kind: Kind.Object, value: [] as JSONObject['value'], span } as const)
    );
    const nonEmpty = surroundedBy(op, sepParser, cl).map(
      ({ result: value, input: { span } }) =>
        ({ kind: Kind.Object, value, span } as const)
    );
    return oneOf(nonEmpty, empty).parse(input);
  },
  expects: 'object',
});

const json: Parser<JSONValue> = oneOf(
  jsonArray,
  jsonObject,
  jsonNull,
  jsonNumber,
  jsonString,
  jsonBoolean
);
export const Json = {
  parse<T>(source: string) {
    const output = json.parse({ source, span: { lo: 0, hi: 0 } });
    if ('result' in output) return processJSONValue(output.result) as T;
    return output;
  },
};

export const processJSONValue = (input: JSONValue): unknown => {
  switch (input.kind) {
    case Kind.Null:
      return null;
    case Kind.String:
      return input.value;
    case Kind.Number:
      return input.value;
    case Kind.Object:
      return input.value.reduce((a, b) => {
        a[b.key.value] = processJSONValue(b.value);
        return a;
      }, {} as Record<string, unknown>);
    case Kind.Array:
      return input.value.map(processJSONValue);
    case Kind.Boolean:
      return input.value;
  }
};
