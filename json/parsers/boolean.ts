import { JSONBoolean, Kind } from '../types/ast.ts';
import { Parser } from '../types/parser.ts';
import { oneOf } from './combinators.ts';
import { literal } from './string.ts';

export const boolean = oneOf(
  literal('false').map((_) => false),
  literal('true').map((_) => true)
)
  .setExpects('boolean')
  .mapErr((_) => 'expected a boolean');

export const jsonBoolean: Parser<JSONBoolean> = boolean.map(
  ({ result: value, input: { span } }) => ({
    kind: Kind.Boolean,
    value,
    span,
  })
);
