import { JSONValue, Kind } from '../types/mod.ts';

export const processJSONValue = (input: JSONValue): any => {
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
      }, {} as Record<string, any>);
    case Kind.Array:
      return input.value.map(processJSONValue);
    case Kind.Boolean:
      return input.value;
  }
};
