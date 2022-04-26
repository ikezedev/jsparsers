import { Span } from '~types/parser.ts';

export enum Kind {
  String = 'string',
  Array = 'array',
  Object = 'object',
  Number = 'number',
  Null = 'null',
  Boolean = 'boolean',
}

export type JSONString = {
  kind: Kind.String;
  value: string;
  span: Span;
};

export type JSONKey = {
  type: 'key';
  value: string;
  span: Span;
};

export type JSONArray = {
  kind: Kind.Array;
  value: JSONValue[];
  span: Span;
};

export type JSONObject = {
  kind: Kind.Object;
  value: Array<{
    key: JSONKey;
    value: JSONValue;
  }>;
  span: Span;
};

export type JSONNumber = {
  kind: Kind.Number;
  value: number;
  span: Span;
};

export type JSONNull = {
  kind: Kind.Null;
  value: null;
  span: Span;
};

export type JSONBoolean = {
  kind: Kind.Boolean;
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
