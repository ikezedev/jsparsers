import { Span } from '~types/parser.ts';

export enum Kind {
  JSONString = 'JSONString',
  JSONArray = 'JSONArray',
  JSONObject = 'JSONObject',
  JSONNumber = 'JSONNumber',
  JSONNull = 'JSONNull',
  JSONBoolean = 'JSONBoolean',
}

export type JSONString = {
  kind: Kind.JSONString;
  value: string;
  span: Span;
};

export type JSONKey = {
  type: 'key';
  value: string;
  span: Span;
};

export type JSONArray = {
  kind: Kind.JSONArray;
  value: JSONValue[];
  span: Span;
};

export type JSONObject = {
  kind: Kind.JSONObject;
  value: Array<{
    key: JSONKey;
    value: JSONValue;
  }>;
  span: Span;
};

export type JSONNumber = {
  kind: Kind.JSONNumber;
  value: number;
  span: Span;
};

export type JSONNull = {
  kind: Kind.JSONNull;
  value: null;
  span: Span;
};

export type JSONBoolean = {
  kind: Kind.JSONBoolean;
  value: boolean;
  span: Span;
};

export type JSONValue =
  | JSONString
  | JSONArray
  | JSONNumber
  | JSONBoolean
  | JSONNull
  | JSONObject;

export function visit(
  root: JSONValue,
  visitor: Partial<JSONVisitor>
): JSONValue {
  let newRoot: JSONValue = structuredClone(root);
  for (const [key, visitFn] of Object.entries(visitor)) {
    newRoot = mapValue(
      newRoot,
      mapIf(visitFn as (arg: JSONValue) => JSONValue),
      key as Kind
    );
  }
  return newRoot;
}

const mapIf =
  <T>(fn: (a: T) => T | void) =>
  (a: T): T => {
    const apply = fn(a);
    return apply !== undefined ? apply : a;
  };

function mapValue(
  input: JSONValue,
  mapFn: (arg: JSONValue) => JSONValue,
  kind: Kind
): JSONValue {
  switch (input.kind) {
    case Kind.JSONNull:
      return kind === Kind.JSONNull ? mapFn(input) : input;
    case Kind.JSONString:
      return kind === Kind.JSONString ? mapFn(input) : input;
    case Kind.JSONNumber:
      return kind === Kind.JSONNumber ? mapFn(input) : input;
    case Kind.JSONObject: {
      const value: JSONObject = {
        ...input,
        value: input.value.map((v) => ({
          ...v,
          value: mapValue(v.value, mapFn, kind),
        })),
      };
      return kind === Kind.JSONObject ? mapFn(value) : value;
    }
    case Kind.JSONArray: {
      const value = {
        ...input,
        value: input.value.map((v) => mapValue(v, mapFn, kind)),
      };
      return kind === Kind.JSONArray ? mapFn(value) : value;
    }
    case Kind.JSONBoolean:
      return kind === Kind.JSONBoolean ? mapFn(input) : input;
  }
}

type JSONVisitor = {
  JSONString: (node: JSONString) => JSONValue | void;
  JSONArray: (node: JSONArray) => JSONValue | void;
  JSONNumber: (node: JSONNumber) => JSONValue | void;
  JSONBoolean: (node: JSONBoolean) => JSONValue | void;
  JSONNull: (node: JSONNull) => JSONValue | void;
  JSONObject: (node: JSONObject) => JSONValue | void;
};
