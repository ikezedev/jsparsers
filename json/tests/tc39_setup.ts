const main = 'json/tests/tc39/test/built-ins/JSON/parse';
const testFile = 'json/tests/test262.test.ts';
let testString = `
// @ts-nocheck : auto generated
import {
  assertThrows,
  assertEquals,
  assertObjectMatch,
} from 'deno.tests';

console.log('Running TC39 tests\\n')

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
  assertObjectMatch(Object.getOwnPropertyDescriptors(obj)[key], expected, msg);

  function assert(expr, msg) {
    return assertEquals(Boolean(expr), true, msg);
  }
  
  assert.throws = (ErrorClass, fn, msg) => assertThrows(fn, ErrorClass, undefined, msg);
  
  assert.sameValue = assertEquals
  
  assert.compareArray = assertEquals
`;

for await (const file of Deno.readDir(main)) {
  if (file.isFile) {
    const content = await Deno.readTextFile(`${main}/${file.name}`);
    const test = removeComments(content);
    testString += '\n\n';
    testString += `
       Deno.test('${file.name.slice(0, -3)}', () => {
           ${test}
       });
      `;
  }
}

await Deno.writeTextFile(testFile, testString);

function removeComments(string: string): string {
  const commentRegexp = new RegExp(/\/\*[\s\S]*?\*\/|\/\/.*\s/g);
  return string.replace(commentRegexp, '').trim();
}

console.log('\nGenerated test file!\n');
