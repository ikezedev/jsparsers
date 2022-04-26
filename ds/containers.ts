export class Pair<T, U> {
  constructor(public first: T, public second: U) {}
  static new<T, U>(t: T, u: U) {
    return new Pair(t, u);
  }
}

export class Triple<T, U, V> {
  constructor(public first: T, public second: U, public third: V) {}
  static new<T, U, V>(t: T, u: U, v: V) {
    return new Triple(t, u, v);
  }
}
