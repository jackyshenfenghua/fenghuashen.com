import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

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

assert.equal(existsSync('assets/aoms-dashboard-clean.png'), true, 'clean AOMS screenshot must exist');
assert.ok(statSync('assets/aoms-dashboard-clean.png').size > 100_000, 'clean AOMS screenshot should be a real image asset');
assert.match(html, /assets\/aoms-dashboard-clean\.png/, 'homepage must reference the clean AOMS screenshot');
assert.doesNotMatch(html, /codex-clipboard-9b0e1df4-2615-4223-b827-aefb33352005\.png/, 'homepage must not reference the temporary upload path');

for (const asset of [
  'assets/profile-photo.jpg',
  'assets/app-paw-diary.png',
  'assets/app-zen-flow.png',
  'assets/app-siply.jpg',
  'assets/app-liminal.jpg'
]) {
  assert.equal(existsSync(asset), true, `${asset} must exist`);
  assert.ok(statSync(asset).size > 20_000, `${asset} should be a real image asset`);
  assert.match(html, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `homepage must reference ${asset}`);
}

const css = read('styles.css');

for (const token of ['--ink', '--surface', '--accent-blue', '--accent-teal', '--accent-green', '--accent-warm']) {
  assert.match(css, new RegExp(token), `missing CSS design token ${token}`);
}

assert.match(css, /@media\s*\(max-width:\s*760px\)/, 'mobile breakpoint is required');
assert.doesNotMatch(css, /letter-spacing\s*:\s*-\d/, 'negative letter spacing is not allowed');
assert.doesNotMatch(css, /font-size\s*:\s*[^;]*vw/, 'viewport-width font sizing is not allowed');
assert.doesNotMatch(css, /border-radius\s*:\s*(?:9|[1-9]\d)px/, 'pixel border radii above 8px are not allowed');

console.log('Static scaffold checks passed.');
