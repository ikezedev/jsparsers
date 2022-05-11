// @ts-nocheck : auto-gen
import { Json as JSON } from '../json.ts';
import { assertThrows, assertEquals, assert, it } from 'deno.tests';

const mustThrow = (ErrorClass, fn, msg) =>
  assertThrows(fn, ErrorClass, undefined, msg);

function isConstructor(f) {
  try {
    Reflect.construct(String, [], f);
  } catch (e) {
    return false;
  }
  return true;
}

const Test262Error = Error;

const verifyProperty = (obj, key, expected, msg) =>
  assertEquals(Object.getOwnPropertyDescriptors(obj)[key], expected, msg);

Deno.test('reviver-object-get-prop-from-prototype.js', () => {
  Object.prototype.b = 3;

  var json = '{"a": 1, "b": 2}';
  var obj = JSON.parse(json, function (key, value) {
    if (key === 'a') {
      assert(delete this.b);
    }

    return value;
  });

  assert(delete Object.prototype.b);
  assertEquals(obj.a, 1);
  assert(obj.hasOwnProperty('b'));
  assertEquals(obj.b, 3);
});

Deno.test('15.12.2-2-2.js', () => {
  var nullChars = new Array();
  nullChars[0] = '"\u0000"';
  nullChars[1] = '"\u0001"';
  nullChars[2] = '"\u0002"';
  nullChars[3] = '"\u0003"';
  nullChars[4] = '"\u0004"';
  nullChars[5] = '"\u0005"';
  nullChars[6] = '"\u0006"';
  nullChars[7] = '"\u0007"';
  nullChars[8] = '"\u0008"';
  nullChars[9] = '"\u0009"';
  nullChars[10] = '"\u000A"';
  nullChars[11] = '"\u000B"';
  nullChars[12] = '"\u000C"';
  nullChars[13] = '"\u000D"';
  nullChars[14] = '"\u000E"';
  nullChars[15] = '"\u000F"';
  nullChars[16] = '"\u0010"';
  nullChars[17] = '"\u0011"';
  nullChars[18] = '"\u0012"';
  nullChars[19] = '"\u0013"';
  nullChars[20] = '"\u0014"';
  nullChars[21] = '"\u0015"';
  nullChars[22] = '"\u0016"';
  nullChars[23] = '"\u0017"';
  nullChars[24] = '"\u0018"';
  nullChars[25] = '"\u0019"';
  nullChars[26] = '"\u001A"';
  nullChars[27] = '"\u001B"';
  nullChars[28] = '"\u001C"';
  nullChars[29] = '"\u001D"';
  nullChars[30] = '"\u001E"';
  nullChars[31] = '"\u001F"';

  for (var index in nullChars) {
    mustThrow(SyntaxError, function () {
      var obj = JSON.parse('{ ' + nullChars[index] + 'name' + ' : "John" } ');
    });
  }
});

Deno.test('reviver-array-non-configurable-prop-delete.js', () => {
  var json = '[1, 2]';
  var arr = JSON.parse(json, function (key, value) {
    if (key === '0') {
      Object.defineProperty(this, '1', { configurable: false });
    }
    if (key === '1') return;

    return value;
  });

  assertEquals(arr[0], 1);
  assert(arr.hasOwnProperty('1'));
  assertEquals(arr[1], 2);
});

Deno.test('text-object.js', () => {
  var hint = JSON.parse({
    toString: function () {
      return '"string"';
    },
    valueOf: function () {
      return '"default_or_number"';
    },
  });

  assertEquals(hint, 'string');
});

Deno.test('duplicate-proto.js', () => {
  var result = JSON.parse('{ "__proto__": 1, "__proto__": 2 }');

  assertEquals(result.__proto__, 2);
});

Deno.test('15.12.1.1-g1-2.js', () => {
  assertEquals(JSON.parse('\r1234'), 1234, '<cr> should be ignored');

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('12\r34');
    },
    '<CR> should produce a syntax error as whitespace results in two tokens'
  );
});

Deno.test('15.12.1.1-g2-5.js', () => {
  assertEquals(JSON.parse('""'), '', 'JSON.parse(\'""\')');
});

Deno.test('15.12.2-2-6.js', () => {
  var nullChars = new Array();
  nullChars[0] = '"\u0000"';
  nullChars[1] = '"\u0001"';
  nullChars[2] = '"\u0002"';
  nullChars[3] = '"\u0003"';
  nullChars[4] = '"\u0004"';
  nullChars[5] = '"\u0005"';
  nullChars[6] = '"\u0006"';
  nullChars[7] = '"\u0007"';
  nullChars[8] = '"\u0008"';
  nullChars[9] = '"\u0009"';
  nullChars[10] = '"\u000A"';
  nullChars[11] = '"\u000B"';
  nullChars[12] = '"\u000C"';
  nullChars[13] = '"\u000D"';
  nullChars[14] = '"\u000E"';
  nullChars[15] = '"\u000F"';
  nullChars[16] = '"\u0010"';
  nullChars[17] = '"\u0011"';
  nullChars[18] = '"\u0012"';
  nullChars[19] = '"\u0013"';
  nullChars[20] = '"\u0014"';
  nullChars[21] = '"\u0015"';
  nullChars[22] = '"\u0016"';
  nullChars[23] = '"\u0017"';
  nullChars[24] = '"\u0018"';
  nullChars[25] = '"\u0019"';
  nullChars[26] = '"\u001A"';
  nullChars[27] = '"\u001B"';
  nullChars[28] = '"\u001C"';
  nullChars[29] = '"\u001D"';
  nullChars[30] = '"\u001E"';
  nullChars[31] = '"\u001F"';

  for (var index in nullChars) {
    mustThrow(SyntaxError, function () {
      var obj = JSON.parse('{ "name" : ' + nullChars[index] + ' } ');
    });
  }
});

Deno.test('not-a-constructor.js', () => {
  assertEquals(
    isConstructor(JSON.parse),
    false,
    'isConstructor(JSON.parse) must return false'
  );

  mustThrow(
    TypeError,
    () => {
      new JSON.parse('{}');
    },
    "`new JSON.parse('{}')` throws TypeError"
  );
});

Deno.test('reviver-object-define-prop-err.js', () => {
  var badDefine = new Proxy(
    {
      0: null,
    },
    {
      defineProperty: function () {
        throw new Test262Error();
      },
    }
  );

  mustThrow(Test262Error, function () {
    JSON.parse('["first", null]', function (_, value) {
      if (value === 'first') {
        this[1] = badDefine;
      }
      return value;
    });
  });
});

Deno.test('15.12.1.1-0-9.js', () => {
  JSON.parse(
    '\t\r \n{\t\r \n' +
      '"property"\t\r \n:\t\r \n{\t\r \n}\t\r \n,\t\r \n' +
      '"prop2"\t\r \n:\t\r \n' +
      '[\t\r \ntrue\t\r \n,\t\r \nnull\t\r \n,123.456\t\r \n]' +
      '\t\r \n}\t\r \n'
  );
});

Deno.test('length.js', () => {
  verifyProperty(JSON.parse, 'length', {
    value: 2,
    writable: false,
    enumerable: false,
    configurable: true,
  });
});

Deno.test('15.12.1.1-g2-1.js', () => {
  assertEquals(JSON.parse('"abc"'), 'abc', 'JSON.parse(\'"abc"\')');
});

Deno.test('15.12.2-2-7.js', () => {
  var nullChars = new Array();
  nullChars[0] = '"\u0000"';
  nullChars[1] = '"\u0001"';
  nullChars[2] = '"\u0002"';
  nullChars[3] = '"\u0003"';
  nullChars[4] = '"\u0004"';
  nullChars[5] = '"\u0005"';
  nullChars[6] = '"\u0006"';
  nullChars[7] = '"\u0007"';
  nullChars[8] = '"\u0008"';
  nullChars[9] = '"\u0009"';
  nullChars[10] = '"\u000A"';
  nullChars[11] = '"\u000B"';
  nullChars[12] = '"\u000C"';
  nullChars[13] = '"\u000D"';
  nullChars[14] = '"\u000E"';
  nullChars[15] = '"\u000F"';
  nullChars[16] = '"\u0010"';
  nullChars[17] = '"\u0011"';
  nullChars[18] = '"\u0012"';
  nullChars[19] = '"\u0013"';
  nullChars[20] = '"\u0014"';
  nullChars[21] = '"\u0015"';
  nullChars[22] = '"\u0016"';
  nullChars[23] = '"\u0017"';
  nullChars[24] = '"\u0018"';
  nullChars[25] = '"\u0019"';
  nullChars[26] = '"\u001A"';
  nullChars[27] = '"\u001B"';
  nullChars[28] = '"\u001C"';
  nullChars[29] = '"\u001D"';
  nullChars[30] = '"\u001E"';
  nullChars[31] = '"\u001F"';

  for (var index in nullChars) {
    mustThrow(SyntaxError, function () {
      var obj = JSON.parse('{ "name" : ' + nullChars[index] + 'John' + ' } ');
    });
  }
});

Deno.test('S15.12.2_A1.js', () => {
  var x = JSON.parse('{"__proto__":[]}');

  assertEquals(
    Object.getPrototypeOf(x),
    Object.prototype,
    'Object.getPrototypeOf("JSON.parse(\'{"__proto__":[]}\')") returns Object.prototype'
  );

  assert(
    Array.isArray(x.__proto__),
    'Array.isArray(x.__proto__) must return true'
  );
});

Deno.test('revived-proxy-revoked.js', () => {
  var handle = Proxy.revocable([], {});
  var returnCount = 0;

  handle.revoke();

  mustThrow(TypeError, function () {
    JSON.parse('[null, null]', function () {
      this[1] = handle.proxy;
      returnCount += 1;
    });
  });

  assertEquals(returnCount, 1, 'invocation returns normally');
});

Deno.test('15.12.1.1-0-8.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse('\u2028\u20291234');
  });
});

Deno.test('reviver-array-non-configurable-prop-create.js', () => {
  var json = '[1, 2]';
  var arr = JSON.parse(json, function (key, value) {
    if (key === '0') {
      Object.defineProperty(this, '1', { configurable: false });
    }
    if (key === '1') return 22;

    return value;
  });

  assertEquals(arr[0], 1);
  assertEquals(arr[1], 2);
});

Deno.test('15.12.2-2-3.js', () => {
  var nullChars = new Array();
  nullChars[0] = '"\u0000"';
  nullChars[1] = '"\u0001"';
  nullChars[2] = '"\u0002"';
  nullChars[3] = '"\u0003"';
  nullChars[4] = '"\u0004"';
  nullChars[5] = '"\u0005"';
  nullChars[6] = '"\u0006"';
  nullChars[7] = '"\u0007"';
  nullChars[8] = '"\u0008"';
  nullChars[9] = '"\u0009"';
  nullChars[10] = '"\u000A"';
  nullChars[11] = '"\u000B"';
  nullChars[12] = '"\u000C"';
  nullChars[13] = '"\u000D"';
  nullChars[14] = '"\u000E"';
  nullChars[15] = '"\u000F"';
  nullChars[16] = '"\u0010"';
  nullChars[17] = '"\u0011"';
  nullChars[18] = '"\u0012"';
  nullChars[19] = '"\u0013"';
  nullChars[20] = '"\u0014"';
  nullChars[21] = '"\u0015"';
  nullChars[22] = '"\u0016"';
  nullChars[23] = '"\u0017"';
  nullChars[24] = '"\u0018"';
  nullChars[25] = '"\u0019"';
  nullChars[26] = '"\u001A"';
  nullChars[27] = '"\u001B"';
  nullChars[28] = '"\u001C"';
  nullChars[29] = '"\u001D"';
  nullChars[30] = '"\u001E"';
  nullChars[31] = '"\u001F"';

  for (var index in nullChars) {
    mustThrow(SyntaxError, function () {
      var obj = JSON.parse('{' + 'name' + nullChars[index] + ' : "John" } ');
    });
  }
});

Deno.test('15.12.1.1-g1-3.js', () => {
  assertEquals(JSON.parse('\n1234'), 1234, '<LF> should be ignored');

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('12\n34');
    },
    '<LF> should produce a syntax error as whitespace results in two tokens'
  );
});

Deno.test('15.12.1.1-g2-4.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse('"ab' + "c'");
  });
});

Deno.test('15.12.1.1-g6-7.js', () => {
  assertEquals(JSON.parse('"\\t"'), '\t', 'JSON.parse(\'"\\t"\')');
});

Deno.test('15.12.2-2-8.js', () => {
  var nullChars = new Array();
  nullChars[0] = '"\u0000"';
  nullChars[1] = '"\u0001"';
  nullChars[2] = '"\u0002"';
  nullChars[3] = '"\u0003"';
  nullChars[4] = '"\u0004"';
  nullChars[5] = '"\u0005"';
  nullChars[6] = '"\u0006"';
  nullChars[7] = '"\u0007"';
  nullChars[8] = '"\u0008"';
  nullChars[9] = '"\u0009"';
  nullChars[10] = '"\u000A"';
  nullChars[11] = '"\u000B"';
  nullChars[12] = '"\u000C"';
  nullChars[13] = '"\u000D"';
  nullChars[14] = '"\u000E"';
  nullChars[15] = '"\u000F"';
  nullChars[16] = '"\u0010"';
  nullChars[17] = '"\u0011"';
  nullChars[18] = '"\u0012"';
  nullChars[19] = '"\u0013"';
  nullChars[20] = '"\u0014"';
  nullChars[21] = '"\u0015"';
  nullChars[22] = '"\u0016"';
  nullChars[23] = '"\u0017"';
  nullChars[24] = '"\u0018"';
  nullChars[25] = '"\u0019"';
  nullChars[26] = '"\u001A"';
  nullChars[27] = '"\u001B"';
  nullChars[28] = '"\u001C"';
  nullChars[29] = '"\u001D"';
  nullChars[30] = '"\u001E"';
  nullChars[31] = '"\u001F"';

  for (var index in nullChars) {
    mustThrow(SyntaxError, function () {
      var obj = JSON.parse('{ "name" : ' + 'John' + nullChars[index] + ' } ');
    });
  }
});

Deno.test('15.12.1.1-g4-1.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse('"\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007"');
  });
});

Deno.test('reviver-object-own-keys-err.js', () => {
  var badKeys = new Proxy(
    {},
    {
      ownKeys: function () {
        throw new Test262Error();
      },
    }
  );

  mustThrow(Test262Error, function () {
    JSON.parse('[0,0]', function () {
      this[1] = badKeys;
    });
  });
});

Deno.test('15.12.1.1-g6-3.js', () => {
  assertEquals(JSON.parse('"\\b"'), '\b', 'JSON.parse(\'"\\b"\')');
});

Deno.test('reviver-wrapper.js', () => {
  Object.defineProperty(Object.prototype, '', {
    set: function () {
      throw new Test262Error('[[Set]] should not be called.');
    },
  });

  var wrapper;
  JSON.parse('2', function () {
    wrapper = this;
  });

  assertEquals(typeof wrapper, 'object');
  assertEquals(Object.getPrototypeOf(wrapper), Object.prototype);
  assertEquals(Object.getOwnPropertyNames(wrapper).length, 1);
  assert(Object.isExtensible(wrapper));

  verifyProperty(wrapper, '', {
    value: 2,
    writable: true,
    enumerable: true,
    configurable: true,
  });
});

Deno.test('reviver-call-order.js', () => {
  var calls = [];
  function reviver(name, val) {
    calls.push(name);
    return val;
  }

  JSON.parse('{"p1":0,"p2":0,"p1":0,"2":0,"1":0}', reviver);

  assertEquals(calls, ['1', '2', 'p1', 'p2', '']);
});

Deno.test('15.12.1.1-0-3.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse('\u000c1234');
  });
});

Deno.test('reviver-object-non-configurable-prop-create.js', () => {
  var json = '{"a": 1, "b": 2}';
  var obj = JSON.parse(json, function (key, value) {
    if (key === 'a') {
      Object.defineProperty(this, 'b', { configurable: false });
    }
    if (key === 'b') return 22;

    return value;
  });

  assertEquals(obj.a, 1);
  assertEquals(obj.b, 2);
});

Deno.test('15.12.1.1-g6-2.js', () => {
  assertEquals(JSON.parse('"\\\\"'), '\\', 'JSON.parse(\'"\\\\"\')');
});

Deno.test('invalid-whitespace.js', () => {
  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u16801');
    },
    '\\u1680'
  );

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u180e1');
    },
    '\\u180e'
  );

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u20001');
    },
    '\\u2000'
  );

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u20011');
    },
    '\\u2001'
  );

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u20021');
    },
    '\\u2002'
  );

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u20031');
    },
    '\\u2003'
  );

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u20041');
    },
    '\\u2004'
  );

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u20051');
    },
    '\\u2005'
  );

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u20061');
    },
    '\\u2006'
  );

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u20071');
    },
    '\\u2007'
  );

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u20081');
    },
    '\\u2008'
  );

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u20091');
    },
    '\\u2009'
  );

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u200a1');
    },
    '\\u200a'
  );

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u202f1');
    },
    '\\u202f'
  );

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u205f1');
    },
    '\\u205f'
  );

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('\u30001');
    },
    '\\u3000'
  );
});

Deno.test('reviver-object-non-configurable-prop-delete.js', () => {
  var json = '{"a": 1, "b": 2}';
  var obj = JSON.parse(json, function (key, value) {
    if (key === 'a') {
      Object.defineProperty(this, 'b', { configurable: false });
    }
    if (key === 'b') return;

    return value;
  });

  assertEquals(obj.a, 1);
  assert(obj.hasOwnProperty('b'));
  assertEquals(obj.b, 2);
});

Deno.test('15.12.1.1-0-2.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse('\u000b1234');
  });
});

Deno.test('reviver-call-err.js', () => {
  mustThrow(Test262Error, function () {
    JSON.parse('0', function () {
      throw new Test262Error();
    });
  });
});

Deno.test('15.12.1.1-g4-4.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse('"\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f"');
  });
});

Deno.test('15.12.1.1-g6-6.js', () => {
  assertEquals(JSON.parse('"\\r"'), '\r', 'JSON.parse(\'"\\r"\')');
});

Deno.test('reviver-array-length-get-err.js', () => {
  var badLength = new Proxy([], {
    get: function (_, name) {
      if (name === 'length') {
        throw new Test262Error();
      }
    },
  });

  mustThrow(Test262Error, function () {
    JSON.parse('[0,0]', function () {
      this[1] = badLength;
    });
  });
});

Deno.test('reviver-get-name-err.js', () => {
  var thrower = function () {
    throw new Test262Error();
  };

  mustThrow(Test262Error, function () {
    JSON.parse('[0,0]', function () {
      Object.defineProperty(this, '1', {
        get: thrower,
      });
    });
  });
});

Deno.test('15.12.1.1-g5-1.js', () => {
  assertEquals(JSON.parse('"\\u0058"'), 'X', 'JSON.parse(\'"\\u0058"\')');
});

Deno.test('text-negative-zero.js', () => {
  assertEquals(JSON.parse('-0'), -0);
  assertEquals(JSON.parse(' \n-0'), -0);
  assertEquals(JSON.parse('-0  \t'), -0);
  assertEquals(JSON.parse('\n\t -0\n   '), -0);

  assertEquals(JSON.parse(-0), 0);
});

Deno.test('15.12.2-2-9.js', () => {
  var nullChars = new Array();
  nullChars[0] = '"\u0000"';
  nullChars[1] = '"\u0001"';
  nullChars[2] = '"\u0002"';
  nullChars[3] = '"\u0003"';
  nullChars[4] = '"\u0004"';
  nullChars[5] = '"\u0005"';
  nullChars[6] = '"\u0006"';
  nullChars[7] = '"\u0007"';
  nullChars[8] = '"\u0008"';
  nullChars[9] = '"\u0009"';
  nullChars[10] = '"\u000A"';
  nullChars[11] = '"\u000B"';
  nullChars[12] = '"\u000C"';
  nullChars[13] = '"\u000D"';
  nullChars[14] = '"\u000E"';
  nullChars[15] = '"\u000F"';
  nullChars[16] = '"\u0010"';
  nullChars[17] = '"\u0011"';
  nullChars[18] = '"\u0012"';
  nullChars[19] = '"\u0013"';
  nullChars[20] = '"\u0014"';
  nullChars[21] = '"\u0015"';
  nullChars[22] = '"\u0016"';
  nullChars[23] = '"\u0017"';
  nullChars[24] = '"\u0018"';
  nullChars[25] = '"\u0019"';
  nullChars[26] = '"\u001A"';
  nullChars[27] = '"\u001B"';
  nullChars[28] = '"\u001C"';
  nullChars[29] = '"\u001D"';
  nullChars[30] = '"\u001E"';
  nullChars[31] = '"\u001F"';

  for (var index in nullChars) {
    mustThrow(SyntaxError, function () {
      var obj = JSON.parse(
        '{ "name" : ' + nullChars[index] + 'John' + nullChars[index] + ' } '
      );
    });
  }
});

Deno.test('15.12.1.1-0-6.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse('\ufeff1234');
  });
});

Deno.test('reviver-array-delete-err.js', () => {
  var badDelete = new Proxy([0], {
    deleteProperty: function () {
      throw new Test262Error();
    },
  });

  mustThrow(Test262Error, function () {
    JSON.parse('[0,0]', function () {
      this[1] = badDelete;
    });
  });
});

Deno.test('revived-proxy.js', () => {
  var objectProxy = new Proxy(
    {
      length: 0,
      other: 0,
    },
    {}
  );
  var arrayProxy = new Proxy([], {});
  var arrayProxyProxy = new Proxy(arrayProxy, {});
  var visitedOther, injectProxy;

  arrayProxy.other = 0;

  injectProxy = function (name, val) {
    if (name === 'other') {
      visitedOther = true;
    }
    this[1] = objectProxy;
    return val;
  };
  visitedOther = false;

  JSON.parse('[null, null]', injectProxy);

  assertEquals(visitedOther, true, 'proxy for ordinary object');

  injectProxy = function (name, val) {
    if (name === 'other') {
      visitedOther = true;
    }
    this[1] = arrayProxy;
    return val;
  };
  visitedOther = false;

  JSON.parse('[null, null]', injectProxy);

  assertEquals(visitedOther, false, 'proxy for array');

  injectProxy = function (name, val) {
    if (name === 'other') {
      visitedOther = true;
    }
    this[1] = arrayProxyProxy;
    return val;
  };
  visitedOther = false;

  JSON.parse('[null, null]', injectProxy);

  assertEquals(visitedOther, false, 'proxy for array proxy');
});

Deno.test('15.12.1.1-g6-1.js', () => {
  assertEquals(JSON.parse('"\\/"'), '/', 'JSON.parse(\'"\\/"\')');
});

Deno.test('text-object-abrupt.js', () => {
  mustThrow(Test262Error, function () {
    JSON.parse({
      toString: null,
      get valueOf() {
        throw new Test262Error();
      },
    });
  });

  mustThrow(Test262Error, function () {
    JSON.parse({
      toString: function () {
        throw new Test262Error();
      },
    });
  });
});

Deno.test('name.js', () => {
  verifyProperty(JSON.parse, 'name', {
    value: 'parse',
    writable: false,
    enumerable: false,
    configurable: true,
  });
});

Deno.test('reviver-array-get-prop-from-prototype.js', () => {
  Array.prototype[1] = 3;

  var json = '[1, 2]';
  var arr = JSON.parse(json, function (key, value) {
    if (key === '0') {
      assert(delete this[1]);
    }

    return value;
  });

  assert(delete Array.prototype[1]);
  assertEquals(arr[0], 1);
  assert(arr.hasOwnProperty('1'));
  assertEquals(arr[1], 3);
});

Deno.test('15.12.1.1-0-1.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse('12\t\r\n 34');
  });
});

Deno.test('15.12.1.1-g6-5.js', () => {
  assertEquals(JSON.parse('"\\n"'), '\n', 'JSON.parse(\'"\\n"\')');
});

Deno.test('15.12.1.1-g5-2.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse('"\\u005"');
  });
});

Deno.test('builtin.js', () => {
  var parse = JSON.parse;
  assert(
    Object.isExtensible(parse),
    'Object.isExtensible(parse) must return true'
  );
  assertEquals(
    typeof parse,
    'function',
    'The value of `typeof parse` is "function"'
  );
  assertEquals(
    Object.prototype.toString.call(parse),
    '[object Function]',
    'Object.prototype.toString.call("JSON.parse") must return "[object Function]"'
  );
  assertEquals(
    Object.getPrototypeOf(parse),
    Function.prototype,
    'Object.getPrototypeOf("JSON.parse") must return the value of Function.prototype'
  );
  assertEquals(
    parse.hasOwnProperty('prototype'),
    false,
    'parse.hasOwnProperty("prototype") must return false'
  );
});

Deno.test('15.12.1.1-g4-3.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse('"\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017"');
  });
});

Deno.test('15.12.1.1-0-5.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse('\u200b1234');
  });
});

Deno.test('15.12.1.1-g6-4.js', () => {
  assertEquals(JSON.parse('"\\f"'), '\f', 'JSON.parse(\'"\\f"\')');
});

Deno.test('15.12.1.1-g5-3.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse('"\\u0X50"');
  });
});

Deno.test('15.12.1.1-g4-2.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse('"\u0008\u0009\u000a\u000b\u000c\u000d\u000e\u000f"');
  });
});

Deno.test('15.12.1.1-0-4.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse('\u00a01234');
  });
});

Deno.test('15.12.2-2-4.js', () => {
  var nullChars = new Array();
  nullChars[0] = '"\u0000"';
  nullChars[1] = '"\u0001"';
  nullChars[2] = '"\u0002"';
  nullChars[3] = '"\u0003"';
  nullChars[4] = '"\u0004"';
  nullChars[5] = '"\u0005"';
  nullChars[6] = '"\u0006"';
  nullChars[7] = '"\u0007"';
  nullChars[8] = '"\u0008"';
  nullChars[9] = '"\u0009"';
  nullChars[10] = '"\u000A"';
  nullChars[11] = '"\u000B"';
  nullChars[12] = '"\u000C"';
  nullChars[13] = '"\u000D"';
  nullChars[14] = '"\u000E"';
  nullChars[15] = '"\u000F"';
  nullChars[16] = '"\u0010"';
  nullChars[17] = '"\u0011"';
  nullChars[18] = '"\u0012"';
  nullChars[19] = '"\u0013"';
  nullChars[20] = '"\u0014"';
  nullChars[21] = '"\u0015"';
  nullChars[22] = '"\u0016"';
  nullChars[23] = '"\u0017"';
  nullChars[24] = '"\u0018"';
  nullChars[25] = '"\u0019"';
  nullChars[26] = '"\u001A"';
  nullChars[27] = '"\u001B"';
  nullChars[28] = '"\u001C"';
  nullChars[29] = '"\u001D"';
  nullChars[30] = '"\u001E"';
  nullChars[31] = '"\u001F"';

  for (var index in nullChars) {
    mustThrow(SyntaxError, function () {
      var obj = JSON.parse(
        '{' + nullChars[index] + 'name' + nullChars[index] + ' : "John" } '
      );
    });
  }
});

Deno.test('prop-desc.js', () => {
  verifyProperty(JSON, 'parse', {
    writable: true,
    enumerable: false,
    configurable: true,
  });
});

Deno.test('15.12.1.1-g2-3.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse('\\u0022abc\\u0022');
  });
});

Deno.test('text-non-string-primitive.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse();
  });

  mustThrow(SyntaxError, function () {
    JSON.parse(undefined);
  });

  assertEquals(JSON.parse(null), null);
  assertEquals(JSON.parse(false), false);
  assertEquals(JSON.parse(true), true);
  assertEquals(JSON.parse(0), 0);
  assertEquals(JSON.parse(3.14), 3.14);

  var sym = Symbol('desc');
  mustThrow(TypeError, function () {
    JSON.parse(sym);
  });
});

Deno.test('15.12.1.1-g1-4.js', () => {
  assertEquals(JSON.parse(' 1234'), 1234, '<SP> should be ignored');

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('12 34');
    },
    '<SP> should produce a syntax error as whitespace results in two tokens'
  );
});

Deno.test('15.12.2-2-10.js', () => {
  var nullChars = new Array();
  nullChars[0] = '"\u0000"';
  nullChars[1] = '"\u0001"';
  nullChars[2] = '"\u0002"';
  nullChars[3] = '"\u0003"';
  nullChars[4] = '"\u0004"';
  nullChars[5] = '"\u0005"';
  nullChars[6] = '"\u0006"';
  nullChars[7] = '"\u0007"';
  nullChars[8] = '"\u0008"';
  nullChars[9] = '"\u0009"';
  nullChars[10] = '"\u000A"';
  nullChars[11] = '"\u000B"';
  nullChars[12] = '"\u000C"';
  nullChars[13] = '"\u000D"';
  nullChars[14] = '"\u000E"';
  nullChars[15] = '"\u000F"';
  nullChars[16] = '"\u0010"';
  nullChars[17] = '"\u0011"';
  nullChars[18] = '"\u0012"';
  nullChars[19] = '"\u0013"';
  nullChars[20] = '"\u0014"';
  nullChars[21] = '"\u0015"';
  nullChars[22] = '"\u0016"';
  nullChars[23] = '"\u0017"';
  nullChars[24] = '"\u0018"';
  nullChars[25] = '"\u0019"';
  nullChars[26] = '"\u001A"';
  nullChars[27] = '"\u001B"';
  nullChars[28] = '"\u001C"';
  nullChars[29] = '"\u001D"';
  nullChars[30] = '"\u001E"';
  nullChars[31] = '"\u001F"';

  for (var index in nullChars) {
    mustThrow(SyntaxError, function () {
      var obj = JSON.parse(
        '{ "name" : ' + 'Jo' + nullChars[index] + 'hn' + ' } '
      );
    });
  }
});

Deno.test('15.12.2-2-1.js', () => {
  var nullChars = new Array();
  nullChars[0] = '"\u0000"';
  nullChars[1] = '"\u0001"';
  nullChars[2] = '"\u0002"';
  nullChars[3] = '"\u0003"';
  nullChars[4] = '"\u0004"';
  nullChars[5] = '"\u0005"';
  nullChars[6] = '"\u0006"';
  nullChars[7] = '"\u0007"';
  nullChars[8] = '"\u0008"';
  nullChars[9] = '"\u0009"';
  nullChars[10] = '"\u000A"';
  nullChars[11] = '"\u000B"';
  nullChars[12] = '"\u000C"';
  nullChars[13] = '"\u000D"';
  nullChars[14] = '"\u000E"';
  nullChars[15] = '"\u000F"';
  nullChars[16] = '"\u0010"';
  nullChars[17] = '"\u0011"';
  nullChars[18] = '"\u0012"';
  nullChars[19] = '"\u0013"';
  nullChars[20] = '"\u0014"';
  nullChars[21] = '"\u0015"';
  nullChars[22] = '"\u0016"';
  nullChars[23] = '"\u0017"';
  nullChars[24] = '"\u0018"';
  nullChars[25] = '"\u0019"';
  nullChars[26] = '"\u001A"';
  nullChars[27] = '"\u001B"';
  nullChars[28] = '"\u001C"';
  nullChars[29] = '"\u001D"';
  nullChars[30] = '"\u001E"';
  nullChars[31] = '"\u001F"';

  for (var index in nullChars) {
    mustThrow(SyntaxError, function () {
      var obj = JSON.parse('{ ' + nullChars[index] + ' : "John" } ');
    });
  }
});

Deno.test('reviver-object-delete-err.js', () => {
  var badDelete = new Proxy(
    {
      a: 1,
    },
    {
      deleteProperty: function () {
        throw new Test262Error();
      },
    }
  );

  mustThrow(Test262Error, function () {
    JSON.parse('[0,0]', function () {
      this[1] = badDelete;
    });
  });
});

Deno.test('reviver-array-define-prop-err.js', () => {
  var badDefine = new Proxy([null], {
    defineProperty: function (_, name) {
      throw new Test262Error();
    },
  });

  mustThrow(Test262Error, function () {
    JSON.parse('["first", null]', function (_, value) {
      if (value === 'first') {
        this[1] = badDefine;
      }
      return value;
    });
  });
});

Deno.test('15.12.1.1-g1-1.js', () => {
  assertEquals(JSON.parse('\t1234'), 1234, '<TAB> should be ignored');

  mustThrow(
    SyntaxError,
    function () {
      JSON.parse('12\t34');
    },
    '<TAB> should produce a syntax error as whitespace results in two tokens'
  );
});

Deno.test('reviver-array-length-coerce-err.js', () => {
  var uncoercible = {
    valueOf: function () {
      throw new Test262Error();
    },
  };
  var badLength = new Proxy([], {
    get: function (_, name) {
      if (name === 'length') {
        return uncoercible;
      }
    },
  });

  mustThrow(Test262Error, function () {
    JSON.parse('[0,0]', function () {
      this[1] = badLength;
    });
  });
});

Deno.test('15.12.2-2-5.js', () => {
  var nullChars = new Array();
  nullChars[0] = '"\u0000"';
  nullChars[1] = '"\u0001"';
  nullChars[2] = '"\u0002"';
  nullChars[3] = '"\u0003"';
  nullChars[4] = '"\u0004"';
  nullChars[5] = '"\u0005"';
  nullChars[6] = '"\u0006"';
  nullChars[7] = '"\u0007"';
  nullChars[8] = '"\u0008"';
  nullChars[9] = '"\u0009"';
  nullChars[10] = '"\u000A"';
  nullChars[11] = '"\u000B"';
  nullChars[12] = '"\u000C"';
  nullChars[13] = '"\u000D"';
  nullChars[14] = '"\u000E"';
  nullChars[15] = '"\u000F"';
  nullChars[16] = '"\u0010"';
  nullChars[17] = '"\u0011"';
  nullChars[18] = '"\u0012"';
  nullChars[19] = '"\u0013"';
  nullChars[20] = '"\u0014"';
  nullChars[21] = '"\u0015"';
  nullChars[22] = '"\u0016"';
  nullChars[23] = '"\u0017"';
  nullChars[24] = '"\u0018"';
  nullChars[25] = '"\u0019"';
  nullChars[26] = '"\u001A"';
  nullChars[27] = '"\u001B"';
  nullChars[28] = '"\u001C"';
  nullChars[29] = '"\u001D"';
  nullChars[30] = '"\u001E"';
  nullChars[31] = '"\u001F"';

  for (var index in nullChars) {
    mustThrow(SyntaxError, function () {
      var obj = JSON.parse(
        '{ ' + 'na' + nullChars[index] + 'me' + ' : "John" } '
      );
    });
  }
});

Deno.test('15.12.1.1-g2-2.js', () => {
  mustThrow(SyntaxError, function () {
    JSON.parse("'abc'");
  });
});
