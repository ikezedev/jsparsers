export interface Show {
  toString(): string;
}

export class Pair<T extends Show, U extends Show> {
  constructor(public first: T, public second: U) {}
  static new<T, U>(t: T, u: U) {
    return new Pair(t, u);
  }
  toString() {
    const { first: f, second: s } = this;
    return f.toString() + s.toString();
  }
}

export class Triple<T extends Show, U extends Show, V extends Show> {
  constructor(public first: T, public second: U, public third: V) {}
  static new<T, U, V>(t: T, u: U, v: V) {
    return new Triple(t, u, v);
  }
  toString() {
    const { first: f, second: s, third: t } = this;
    return f.toString() + s.toString() + t.toString();
  }
}
