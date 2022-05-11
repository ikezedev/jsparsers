const main = 'json/tests/tc39/test/built-ins/JSON/parse';
const testFile = 'json/tests/test262.test.ts';
let testString = `
function assert(expr, msg) {
    return assertEquals(Boolean(expr), true, msg);
  }
  
  assert.throws = (ErrorClass, fn, msg) => assertThrows(fn, ErrorClass, msg);
  
  assert.sameValue = (actual, expected, msg) =>
    assertEquals(actual, expected, msg);
  
  assert.compareArray = (actual, expected, msg) =>
    assertEquals(actual, expected, msg);
  
  const Test262Error = Error;
  
  const verifyProperty = (obj, key, expected, msg) =>
    assertEquals(Object.getOwnPropertyDescriptors(obj)[key], expected, msg);`;

for await (const file of Deno.readDir(main)) {
  if (file.isFile) {
    const content = await Deno.readTextFile(`${main}/${file.name}`);
    const test = removeComments(content);
    testString += '\n\n';
    testString += `
       Deno.test('${file.name}', () => {
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
