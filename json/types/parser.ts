export type Input = {
  source: string;
  span: Span;
};

export type Span = {
  lo: number;
  hi: number;
};

export type IResult<T> = {
  input: Input;
  result: T;
};

export type IError = {
  input: Input;
  error: string;
};

export type Output<T> = IResult<T> | IError;

export class Parser<T> {
  private constructor(
    public parse: (inp: Input) => Output<T>,
    public expects: string
  ) {}
  static new<T>({
    parse,
    expects,
  }: {
    parse(inp: Input): Output<T>;
    expects: string;
  }) {
    return new Parser(parse, expects);
  }

  setExpects(lit: string) {
    this.expects = lit;
    return this;
  }

  map<U>(fn: (result: T) => U) {
    const parseFn = this.parse;
    const expects = this.expects;
    return Parser.new({
      parse(input: Input) {
        const output = parseFn(input);
        if ('result' in output) return { ...output, result: fn(output.result) };
        return output;
      },
      expects,
    });
  }

  mapOutput<U>(fn: (output: Output<T>) => Output<U>) {
    const parseFn = this.parse;
    const expects = this.expects;
    return Parser.new({
      parse(input: Input) {
        const output = parseFn(input);
        if ('result' in output) return fn(output);
        return output;
      },
      expects,
    });
  }

  mapErr(fn: (error: string) => string) {
    const parseFn = this.parse;
    const expects = this.expects;
    return Parser.new({
      parse(input: Input) {
        const output = parseFn(input);
        if ('result' in output) return output;
        return { ...output, error: fn(output.error) };
      },
      expects,
    });
  }

  biMap<U>({
    map: mapFn,
    mapErr: mapErrFn,
  }: {
    map: (result: T) => U;
    mapErr: (error: string) => string;
  }) {
    return this.map(mapFn).mapErr(mapErrFn);
  }
}
