# JSParsers

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
    inOrder(Parser<T>, Parser<U>, Parser<V>): Parser<Pair<T, U, V>>
    ```

- separatedBy

    ```ts
    separatedBy(Parser<T>, separator: Parser<U>): Parser<T[]>
    ```

- surroundedBy

    ```ts
    surroundedBy(start: Parser<U>, Parser<T>, end: Parser<V>): Parser<T[]>
    ```
