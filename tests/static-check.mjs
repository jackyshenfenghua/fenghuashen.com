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

for (const text of [
  '运营管理智能自动化',
  '业务理解 × AI 工具 × 运营落地',
  '企业真正需要的不是更多 AI 工具',
  '企业 AI 落地诊断',
  '企业知识库',
  '自动报告',
  '数据分析看板',
  '本地大模型',
  'EPC',
  'PMC',
  'EPCm',
  'iOS App Store',
  '微信',
  '邮箱'
]) {
  assert.match(html, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing required copy: ${text}`);
}

assert.match(html, /mailto:[^"]+@[^"]+\.[^"]+/, 'email link must be a real mailto link');
assert.doesNotMatch(html, /Wood China/i, 'public HTML must not include Wood China');
const draftMarkers = ['YOUR_', 'example.com', '待' + '提供', '待' + '补', '占' + '位'];
for (const marker of draftMarkers) {
  assert.equal(html.includes(marker), false, `public HTML must not contain draft marker: ${marker}`);
}

const appStoreLinks = [...html.matchAll(/https:\/\/apps\.apple\.com\/[^\"]+/g)];
assert.equal(appStoreLinks.length, 4, 'homepage must include exactly four App Store links');

console.log('Static scaffold checks passed.');
