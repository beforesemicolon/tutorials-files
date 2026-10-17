const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { Directory, File, FileSystem } = vm.runInNewContext(
  fs.readFileSync('tree-file-system.js', 'utf8') + '\n({ Directory, File, FileSystem })'
);
const directory = new Directory('docs');
assert.equal(directory.type, 'DEFAULT');
const file = new File('note', 'hello');
assert.equal(directory.insertItem(file), true);
assert.equal(file.path, 'docs/note');
assert.equal(directory.getItem('note'), file);
const copy = directory.copy;
assert.equal(copy.name, 'docs copy');
assert.notEqual(copy.getItem('note'), file);
assert.equal(copy.getItem('note').textContent, 'hello');
assert.equal(directory.removeItem('note'), true);
assert.equal(file.parent, null);
const system = new FileSystem();
system.createDirectory('docs');
assert.equal(system.openDirectory('docs').name, 'docs');
assert.equal(system.createFile('example', 'content').path, 'root/docs/example');
assert.equal(system.goBack(), system.root);
console.log('PASS: directory defaults, insert/remove/copy, and file-system navigation regressions');
