export enum Kind {
  String,
  Array,
  Object,
  Number,
  Null,
  Boolean,
}

export type JSONString = {
  kind: Kind.String;
  value: string;
};

export type JSONArray = {
  kind: Kind.Array;
  value: JSONValue[];
};

export type JSONObject = {
  kind: Kind.Object;
  value: Array<{
    key: string;
    value: JSONValue;
  }>;
};

export type JSONNumber = {
  kind: Kind.Number;
  value: number;
};

export type JSONNull = {
  kind: Kind.Null;
  value: null;
};

export type JSONBoolean = {
  kind: Kind.Boolean;
  value: boolean;
};

export type JSONValue =
  | JSONString
  | JSONArray
  | JSONNumber
  | JSONBoolean
  | JSONNull
  | JSONObject;
