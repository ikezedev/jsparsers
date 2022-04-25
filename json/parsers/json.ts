import { JSONValue } from '../types/ast.ts';
import { Parser } from '../types/parser.ts';
import { jsonArray, jsonObject } from './array.ts';
import { oneOf } from './combinators.ts';

export const json: Parser<JSONValue> = oneOf(jsonArray, jsonObject);
