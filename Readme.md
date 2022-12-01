# JSParsers

## Better docs coming!

## A collections of parsers and parser combinators written in Typescript

### Parsers

- JSON parser

### Parser combinators

- oneOf

    ```ts
    oneOf(...Parser<T | U | V | ...>[]): Parser<T | U | V>
    ```

- oneOrMore

    ```ts
    oneOrMore(Parser<T>): Parser<T[]>
    ```

- inOrder

    ```ts
    inOrder(Parser<T>, Parser<U>): Parser<Pair<T, U>>
    inOrder(Parser<T>, Parser<U>, Parser<V>): Parser<Triple<T, U, V>>
    ```

- separatedBy

    ```ts
    separatedBy(Parser<T>, separator: Parser<U>): Parser<T[]>
    ```

- surroundedBy

    ```ts
    surroundedBy(start: Parser<U>, Parser<T>, end: Parser<V>): Parser<T[]>
    ```

## Run Test

Ensure you have [Deno](https://deno.land) installed

- Run `deno task test` to run all tests except the tc39 tests
- Run `deno task test:tc39` to run tc39 compliance tests for [json](./json/mod.ts) parser