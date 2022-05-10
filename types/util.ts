export type Tuple<
  T,
  N extends number,
  R extends readonly T[] = []
> = R['length'] extends N ? R : Tuple<T, N, readonly [T, ...R]>;
