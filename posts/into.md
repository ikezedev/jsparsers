# Let's build a parser combinator library

## Handroll a simple but not trivial parser combinator library and use it to implement a spec-compliant JSON parser

### I will be making the following assumptions about you:

- You know Javascript and Typescript quite well (I will explain any complex Type, frett not!)
- You are curious about how (or already have an idea) parsers work

### What is parser combinator?

> (Wikipedia) a parser combinator is a higher-order function that accepts several parsers as input and returns a new parser as its output. In this context.

From the definition above we can define a parser combinator like:

```ts
 type ParserCombinator<T> = (...parsers: Array<Parser<any>>) => Parser<T>
```

### What then is the definition of a parser?

>(wikipedia) A parser is a function accepting strings as input and returning some structure as output, typically a parse tree or a set of indices representing locations in the string where parsing stopped successfully.

Roughly translates to:

```ts
    type Parser<T> = (input: string) => Output<T>
    // what Output might look like
    type Output<T> = {
        result: T;
        start: number;
        end: number;
        source: string;
    }
```

We will flesh this out in a moment. But the cool thing is in the type definition of `ParserCombinator<T>`, it is a function for composition of parsers like (.) in haskell.

### Let's jump into the code

#### First: Let's create Input and Output types for our parser. Using a string as an input is fine but falls short quite very fast, say you want to 