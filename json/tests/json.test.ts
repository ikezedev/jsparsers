import { Json as JSON } from '../mod.ts';
import { assertThrows, assert, assertEquals } from 'deno.tests';

Deno.test('json test', () => {
  const input =
    '{"name": "ike", "age": 27, "array": ["me", 4, [1, 2, 3, {"name": 123}]]}';
  const output = JSON.parse(input);
  console.log(output);
});

Deno.test('json test1', () => {
  const input = '{"name": "ike", "age": 27, "empty": {}}';
  const output = JSON.parse(input, (key, value) => {
    console.log(key); // log the current property name, the last is "".
    return value; // return the unchanged property value.
  });
  console.log(output);
  JSON.parse('{"1": 1, "2": 2, "3": {"4":4}}', (key, value) => {
    console.log(key); // log the current property name, the last is "".
    return value; // return the unchanged property value.
  });
});

Deno.test('another', function () {
  let wrapper;
  JSON.parse('2', function () {
    wrapper = this;
  });
  console.log(Object.getOwnPropertyDescriptors(wrapper));
});

Deno.test('another 1', () => {
  assertThrows(() => JSON.parse('"ab' + "c'"));
});

Deno.test('reviver-object-get-prop-from-prototype.js', () => {
  Object.prototype.b = 3;

  var json = '{"a": 1, "b": 2}';
  var obj = JSON.parse(json, function (key, value) {
    if (key === 'a') {
      console.log({ rr: this });
      assert(delete this.b);
    }

    return value;
  });

  assert(delete Object.prototype.b);
  console.log({ obj });
  assertEquals(obj.a, 1);
  assert(obj.hasOwnProperty('b'));
  assertEquals(obj.b, 3);
});

// Deno.test('15.12.1.1-g1-2.js', () => {
//   assertEquals(JSON.parse('\r1234'), 1234, '<cr> should be ignored');

//   assertThrows(
//     function () {
//       JSON.parse('12\r34');
//     },
//     SyntaxError,
//     undefined,
//     '<CR> should produce a syntax error as whitespace results in two tokens'
//   );
// });

// Deno.test('15.12.1.1-0-9.js', () => {
//   JSON.parse(
//     '\t\r \n{\t\r \n' +
//       '"property"\t\r \n:\t\r \n{\t\r \n}\t\r \n,\t\r \n' +
//       '"prop2"\t\r \n:\t\r \n' +
//       '[\t\r \ntrue\t\r \n,\t\r \nnull\t\r \n,123.456\t\r \n]' +
//       '\t\r \n}\t\r \n'
//   );
// });

// Deno.test('S15.12.2_A1.js', () => {
//   var x = JSON.parse('{"__proto__":[]}');

//   assertEquals(
//     Object.getPrototypeOf(x),
//     Object.prototype,
//     'Object.getPrototypeOf("JSON.parse(\'{"__proto__":[]}\')") returns Object.prototype'
//   );

//   assert(
//     Array.isArray(x.__proto__),
//     'Array.isArray(x.__proto__) must return true'
//   );
// });
