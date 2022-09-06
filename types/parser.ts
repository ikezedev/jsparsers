export type Input = {
  source: Source;
  span: Span;
};

export type Span = {
  lo: number;
  hi: number;
};

export type IResult<T> = Input & {
  result: T;
};

export type IError = Input & {
  error: string;
};

export type Output<T> = IResult<T> | IError;

export class Source {
  length: number;
  constructor(private src: string) {
    this.length = src.length;
  }
  substring(start: number, end?: number) {
    return this.src.substring(start, end);
  }
  peek(index: number) {
    return this.src[index];
  }

  peekHi(input: Input) {
    return this.peek(input.span.hi);
  }

  static toDefaultInput(src: string): Input {
    return {
      source: new Source(src),
      span: { lo: 0, hi: 0 },
    };
  }
}
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

  map<U>(fn: (out: IResult<T>) => U) {
    const parseFn = this.parse;
    const expects = this.expects;
    return Parser.new({
      parse(input: Input) {
        const output = parseFn(input);
        if ('result' in output) return { ...output, result: fn(output) };
        return output;
      },
      expects,
    });
  }

  chain<U>(fn: (out: IResult<T>) => Output<U>) {
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

  mapResult<U>(fn: (result: T) => U) {
    return this.map(({ result }) => fn(result));
  }

  inspect<U extends Output<T> = Output<T>>(
    fn: (out: U) => void,
    guard?: (o: Output<T>) => o is U
  ) {
    const parseFn = this.parse;
    const expects = this.expects;
    return Parser.new({
      parse(input: Input) {
        const output = parseFn(input);
        if (guard?.(output) || !guard) fn(output as U);
        return output;
      },
      expects,
    });
  }

  inspectResult(fn: (out: Output<T>) => void) {
    return this.inspect(fn, (o): o is IResult<T> => 'result' in o);
  }

  inspectError(fn: (error: IError) => void) {
    return this.inspect(fn, (o): o is IError => 'error' in o);
  }

  // TODO: take whole output like in map
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
}
