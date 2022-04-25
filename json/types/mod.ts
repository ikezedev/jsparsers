export * from './ast.ts';
export * from './parser.ts';

export class Pair<T, U> {
  constructor(public first: T, public second: U) {}
  *[Symbol.iterator]() {
    yield this.first;
    yield this.second;
  }
  static new<T, U>(t: T, u: U) {
    return new Pair(t, u);
  }
  map<X>(fn: (p: T | U) => X) {
    return [...this].map(fn);
  }
}

export class Triple<T, U, V> {
  constructor(public first: T, public second: U, public third: V) {}
  *[Symbol.iterator]() {
    yield this.first;
    yield this.second;
    yield this.third;
  }
  static new<T, U, V>(t: T, u: U, v: V) {
    return new Triple(t, u, v);
  }
  map<X>(fn: (p: T | U | V) => X) {
    return [...this].map(fn);
  }
}
