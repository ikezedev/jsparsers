import {
  boolean,
  literal,
  nullParser,
  number,
  optionalWhitespaces as ows,
  stringNew,
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

type Reviver = (key: string, value: unknown) => unknown;

const jsonString: Parser<JSONString> = stringNew.map(
  ({ result: value, input: { span } }) => ({
    kind: Kind.String,
    value,
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
    const key = inOrder(ows, jsonKey, ows)
      .map(({ result }) => result.second)
      .setExpects('key');
    const colon = literal(':').setExpects('colon');
    const elements = oneOf(
      jsonNull,
      jsonBoolean,
      jsonString,
      jsonNumber,
      jsonArray,
      jsonObject
    );

    const value = inOrder(ows, elements, ows)
      .map(({ result }) => result.second)
      .setExpects('value');

    const entry = inOrder(key, colon, value).map(({ result }) => ({
      key: result.first,
      value: result.third,
    }));
    const comma = inOrder(ows, literal`,`, ows).setExpects('comma');
    const sepParser = separatedBy(entry, comma);
    const empty = surroundedBy(op, ows, cl)
      .map(
        ({ input: { span } }) =>
          ({
            kind: Kind.Object,
            value: [] as JSONObject['value'],
            span,
          } as const)
      )
      .setExpects('nothing');
    const nonEmpty = surroundedBy(op, sepParser, cl).map(
      ({ result: value, input: { span } }) =>
        ({ kind: Kind.Object, value, span } as const)
    );
    return oneOf(nonEmpty, empty).parse(input);
  },
  expects: 'object',
});

const json: Parser<JSONValue> = surroundedBy(
  ows,
  oneOf(jsonNull, jsonNumber, jsonString, jsonBoolean, jsonArray, jsonObject)
);
export const Json = {
  parse<T = any>(text: string, reviver?: Reviver) {
    const output = json.parse({
      source: text.toString(),
      span: { lo: 0, hi: 0 },
    });
    if ('result' in output) {
      const hi = output.input.span.hi;
      if (hi !== text.toString().length)
        throw new SyntaxError(`Unexpected token in JSON at ${hi}`);
      return processJSONValue(output.result, reviver) as T;
    }
    throw new SyntaxError(output.error);
  },
};

export function processJSONValue(input: JSONValue, reviver?: Reviver): unknown {
  let result: unknown;
  switch (input.kind) {
    case Kind.Null:
      result = null;
      break;
    case Kind.String:
      result = input.value;
      break;
    case Kind.Number:
      result = input.value;
      break;
    case Kind.Object:
      result = input.value.reduce((a, b) => {
        const [key, value] = [b.key.value, processJSONValue(b.value)];
        if (reviver) {
          a[key] = reviver.apply({ [key]: value }, [key, value]);
        } else {
          a[b.key.value] = processJSONValue(b.value);
        }
        return a;
      }, {} as Record<string, unknown>);
      break;
    case Kind.Array:
      result = input.value.map((v) => processJSONValue(v));
      break;
    case Kind.Boolean:
      result = input.value;
  }
  if (reviver) return reviver.apply({ '': result }, ['', result]);
  return result;
}
