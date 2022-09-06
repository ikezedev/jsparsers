import {
  boolean,
  literal as l,
  nullParser,
  number,
  optionalWhitespaces as ows,
  stringNew,
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
import { Input, Parser, Source } from '~types/parser.ts';

type Reviver = (key: string, value: unknown) => unknown;

const jsonString: Parser<JSONString> = stringNew.map(
  ({ result: value, span }) => ({
    kind: Kind.JSONString,
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
  ({ result: value, span }) => ({
    kind: Kind.JSONNumber,
    value,
    span,
  })
);

const jsonNull: Parser<JSONNull> = nullParser.map(
  ({ result: value, span }) => ({
    kind: Kind.JSONNull,
    value,
    span,
  })
);

const jsonBoolean: Parser<JSONBoolean> = boolean.map(
  ({ result: value, span }) => ({
    kind: Kind.JSONBoolean,
    value,
    span,
  })
);

export const jsonArray: Parser<JSONArray> = Parser.new<JSONArray>({
  parse(input: Input) {
    const op = surroundedBy(ows, l`[`);
    const cl = surroundedBy(ows, l`]`);
    const elements = oneOf(
      jsonNull,
      jsonBoolean,
      jsonString,
      jsonNumber,
      jsonObject,
      jsonArray
    );
    const comma = l`,`;
    const sepParser = separatedBy(elements, inOrder(ows, comma, ows));
    const empty = surroundedBy(op, ows, cl).map(
      ({ span }) =>
        ({ kind: Kind.JSONArray, value: [] as JSONValue[], span } as const)
    );
    const nonEmpty = surroundedBy(op, sepParser, cl).map(
      ({ result: value, span }) =>
        ({ kind: Kind.JSONArray, value, span } as const)
    );
    return oneOf(nonEmpty, empty).parse(input);
  },
  expects: 'array',
});

export const jsonObject: Parser<JSONObject> = Parser.new<JSONObject>({
  parse(input: Input) {
    const op = surroundedBy(ows, l`{`);
    const cl = surroundedBy(ows, l`}`);
    const key = inOrder(ows, jsonKey, ows)
      .map(({ result }) => result.second)
      .setExpects('key');
    const colon = l`:`.setExpects('colon');
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
    const comma = inOrder(ows, l`,`, ows).setExpects('comma');
    const sepParser = separatedBy(entry, comma);
    const empty = surroundedBy(op, ows, cl)
      .map(
        ({ span }) =>
          ({
            kind: Kind.JSONObject,
            value: [] as JSONObject['value'],
            span,
          } as const)
      )
      .setExpects('nothing');
    const nonEmpty = surroundedBy(op, sepParser, cl).map(
      ({ result: value, span }) =>
        ({ kind: Kind.JSONObject, value, span } as const)
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
    if (typeof text === 'symbol')
      throw new TypeError('Cannot convert a Symbol value to a string');

    const output = json.parse(Source.toDefaultInput(String(text)));

    if ('result' in output) {
      // move to parser
      const hi = output.span.hi;
      if (hi !== String(text).length)
        throw new SyntaxError(`Unexpected token in JSON at ${hi}`);

      return reviveObj(processJSONValue(output.result), reviver) as T;
    }
    throw new SyntaxError(output.error);
  },
};

Object.defineProperties(Json, {
  parse: {
    enumerable: false,
  },
  [Symbol('Symbol.toStringTag')]: {
    configurable: true,
    value: 'JSON',
  },
});

export function processJSONValue(input: JSONValue): unknown {
  switch (input.kind) {
    case Kind.JSONNull:
      return null;
    case Kind.JSONString:
      return input.value;
    case Kind.JSONNumber:
      return input.value;
    case Kind.JSONObject:
      return input.value.reduce((a, b) => {
        a[b.key.value] = processJSONValue(b.value);
        return a;
      }, {} as Record<string, unknown>);
    case Kind.JSONArray:
      return input.value.map((v) => processJSONValue(v));
    case Kind.JSONBoolean:
      return input.value;
  }
}

type R = Record<string, unknown>;

function reviveObj(parsed: unknown, reviver?: Reviver, topLevel = true) {
  reviver =
    typeof reviver === 'function' ? reviver : (_: string, v: unknown) => v;

  if (typeof parsed === 'object' && parsed !== null) {
    const isArray = Array.isArray(parsed);
    const keys = isArray
      ? Array.from({ length: parsed.length }, (_, i) => String(i))
      : Object.keys(parsed);

    for (const key of keys) {
      const { value, configurable } =
        Object.getOwnPropertyDescriptor(parsed, key) ?? {};

      const nextValue =
        typeof value !== 'object' ? value : reviveObj(value, reviver, false);

      const val = reviver.bind(parsed)(key, nextValue);

      if (configurable) {
        (parsed as R)[key] = value;

        // TODO: re-arrange
        if (val === undefined) delete (parsed as R)[key];
      }
    }

    Object.assign(parsed, Object.getPrototypeOf(parsed));
  }
  return !topLevel ? parsed : reviver.bind({ '': parsed })('', parsed);
}

export { json as jsonParser };
