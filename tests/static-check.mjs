import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

for (const path of ['index.html', 'styles.css', 'script.js']) {
  assert.equal(existsSync(path), true, `${path} must exist`);
}

const html = read('index.html');

assert.match(html, /<html lang="zh-CN">/, 'document language must be zh-CN');
assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1\.0">/, 'mobile viewport meta is required');
assert.match(html, /href="styles\.css"/, 'index.html must load styles.css');
assert.match(html, /src="script\.js"/, 'index.html must load script.js');

for (const id of ['home', 'problems', 'solutions', 'case-study', 'capabilities', 'work', 'profile', 'contact']) {
  assert.match(html, new RegExp(`id="${id}"`), `missing section #${id}`);
}

console.log('Static scaffold checks passed.');
