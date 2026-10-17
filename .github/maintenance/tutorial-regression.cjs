const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, dependencies = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports, require(name) {
      assert.ok(name in dependencies, `Unexpected import: ${name}`);
      return dependencies[name];
    }, ...globals,
  }, { filename: file });
  return exports;
}
(async () => {
  const EventType = { READY: 'ready', CREATED: 'created', REMOVED: 'removed' };
  const calls = [];
  let release;
  const created = new Promise(resolve => { release = resolve; });
  class ClientStore {
    constructor(name, schema, config) { this.config = config; }
    subscribe(callback) { this.subscriber = callback; }
    beforeChange(callback) { this.before = callback; }
    async loadItems(items) { calls.push(['load', items]); }
  }
  const { todoStore } = load('src/todos.store.ts', {
    'client-web-storage': { ClientStore, EventType, StorageType: { MEMORYSTORAGE: 'memory' }, Schema: class {}, SchemaValue: class {} },
    './todos.service': { todosService: {
      getTodos: async () => [{ id: 'one', name: 'existing' }],
      createTodo: async data => { await created; calls.push(['create', data]); },
      deleteTodo: async id => calls.push(['delete', id]),
    } },
  });
  assert.equal(todoStore.config.version, 1);
  assert.equal(todoStore.config.type, 'memory');
  assert.equal(todoStore.config.idKeyName, 'id');
  const data = { id: 'new', name: 'new task' };
  let finished = false;
  const pending = todoStore.before(EventType.CREATED, { data, id: 'new' }).then(result => {
    assert.equal(result, undefined);
    finished = true;
  });
  await Promise.resolve();
  assert.equal(finished, false, 'Store must await the API before completing a change');
  release();
  await pending;
  assert.deepEqual(calls.shift(), ['create', data]);
  await todoStore.before(EventType.REMOVED, { data: 'new', id: 'new' });
  assert.deepEqual(calls.shift(), ['delete', 'new']);
  await todoStore.subscriber(EventType.READY);
  assert.deepEqual(calls.shift(), ['load', [{ id: 'one', name: 'existing' }]]);
  let request;
  let resolveFetch;
  const response = new Promise(resolve => { resolveFetch = resolve; });
  const { ApiService } = load('src/api.service.ts', {}, {
    fetch: (url, options) => { request = { url, options }; return response; },
  });
  const result = new ApiService().post('/todos', data);
  assert.equal(typeof result.then, 'function', 'post must return the pending fetch promise');
  assert.equal(request.url, 'http://localhost:4500/api/todos');
  assert.equal(request.options.method, 'POST');
  assert.deepEqual(JSON.parse(request.options.body), data);
  resolveFetch({ json: async () => data });
  assert.equal(await result, data);
  const failure = new Error('offline');
  const { ApiService: FailingApi } = load('src/api.service.ts', {}, { fetch: async () => { throw failure; } });
  await assert.rejects(new FailingApi().post('/todos', data), failure);
  console.log('PASS: storage API exports/config, create/remove interception, awaited POST, and API failure regressions');
})().catch(error => { console.error(error); process.exitCode = 1; });
