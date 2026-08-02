# Personal AI Operations Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished static personal website for the “运营管理智能自动化” expert brand, focused on converting enterprise leaders and partners into WeChat or email conversations about business AI implementation.

**Architecture:** The first version is a dependency-free static site: semantic HTML for all public content, one CSS file for visual system and responsive layout, one JavaScript file for light progressive enhancement, and an assets folder for images. A small Node.js test script validates required files, content markers, contact links, responsive metadata, and privacy-sensitive copy rules before visual QA.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js built-in modules, local static server for browser verification.

## Global Constraints

- Use Chinese as the primary language and English only as short professional accents.
- Position the site as “个人真实姓名 + 运营管理智能自动化”, with the personal name supplied by the user before final content is published.
- Primary conversion target: enterprise AI implementation diagnosis through WeChat or email contact.
- First version contact methods: WeChat and email only.
- The visible AOMS screenshot must not show “Wood China”.
- Keep the first version static: no blog system, backend, online booking, login, database, form submission, pricing page, or full multilingual switcher.
- Use the minimal maintainable structure: `index.html`, `styles.css`, `script.js`, `assets/`, `tests/`, and `README.md`.
- Do not add external runtime dependencies.
- Do not infer private legal identity, email address, WeChat ID, App Store links, or personal photo from filesystem paths or screenshots.
- Cards and framed repeated items use `border-radius: 8px` or lower.
- Do not use viewport-width-based font sizing or negative letter spacing.
- Avoid a one-note blue-purple gradient look; use a restrained palette with deep ink, clean white, blue, teal, green, and limited warm accents.

---

## File Structure

- `index.html`: Owns the complete static page content, semantic sections, SEO metadata, navigation anchors, CTA buttons, AOMS case figure, capability matrix, work cards, profile section, and contact section.
- `styles.css`: Owns all visual design, layout, responsive behavior, component states, accessibility focus states, and print-safe defaults.
- `script.js`: Owns smooth anchor scrolling, active navigation highlighting, reveal-on-scroll enhancement, AOMS image preview dialog, and copy-to-clipboard for WeChat or email text.
- `assets/aoms-dashboard-clean.png`: Cleaned AOMS dashboard screenshot with the “Wood China” text removed.
- `assets/profile-photo.*`: User-supplied profile photo when available.
- `assets/wechat-qr.*`: User-supplied WeChat QR code when available.
- `tests/static-check.mjs`: Dependency-free validation script for structure, required text, contact links, asset references, and CSS guardrails.
- `README.md`: Explains how to open, test, and update the static site.

---

### Task 1: Static Scaffold And Validation Harness

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`
- Create: `assets/.gitkeep`
- Create: `tests/static-check.mjs`

**Interfaces:**
- Consumes: Design spec at `docs/superpowers/specs/2026-08-02-personal-ai-operations-website-design.md`.
- Produces: `npm test` command that later tasks extend; baseline page sections with stable IDs used by navigation and tests.

- [ ] **Step 1: Write the failing scaffold test**

Create `tests/static-check.mjs` with this content:

```javascript
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node tests/static-check.mjs
```

Expected: FAIL because `index.html`, `styles.css`, and `script.js` do not exist yet.

- [ ] **Step 3: Add minimal static scaffold**

Create `package.json`:

```json
{
  "name": "personal-ai-operations-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "test": "node tests/static-check.mjs",
    "serve": "python3 -m http.server 4173"
  }
}
```

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>运营管理智能自动化</title>
    <meta name="description" content="面向企业老板、高管和合作伙伴的业务 AI 落地个人专家主页。">
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <header class="site-header" id="home">
      <nav class="site-nav" aria-label="主导航">
        <a href="#home">首页</a>
        <a href="#solutions">方案</a>
        <a href="#case-study">案例</a>
        <a href="#work">作品</a>
        <a href="#contact">联系</a>
      </nav>
    </header>
    <main>
      <section class="hero" aria-labelledby="hero-title">
        <p class="eyebrow">AI-Powered Operations Management</p>
        <h1 id="hero-title">运营管理智能自动化</h1>
      </section>
      <section id="problems" aria-labelledby="problems-title"><h2 id="problems-title">企业 AI 落地的关键断层</h2></section>
      <section id="solutions" aria-labelledby="solutions-title"><h2 id="solutions-title">可落地的支持方向</h2></section>
      <section id="case-study" aria-labelledby="case-title"><h2 id="case-title">企业运营管理智能化 Demo</h2></section>
      <section id="capabilities" aria-labelledby="capabilities-title"><h2 id="capabilities-title">能力矩阵</h2></section>
      <section id="work" aria-labelledby="work-title"><h2 id="work-title">代表作品</h2></section>
      <section id="profile" aria-labelledby="profile-title"><h2 id="profile-title">个人简介</h2></section>
      <section id="contact" aria-labelledby="contact-title"><h2 id="contact-title">联系交流</h2></section>
    </main>
    <script src="script.js"></script>
  </body>
</html>
```

Create `styles.css`:

```css
:root {
  color: #172033;
  background: #f6f8fb;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  margin: 0;
}

section {
  padding: 72px 24px;
}
```

Create `script.js`:

```javascript
document.documentElement.classList.add('js-ready');
```

Create `assets/.gitkeep` as an empty file.

- [ ] **Step 4: Run the scaffold test to verify it passes**

Run:

```bash
npm test
```

Expected: PASS with `Static scaffold checks passed.`

- [ ] **Step 5: Commit**

```bash
git add package.json index.html styles.css script.js assets/.gitkeep tests/static-check.mjs
git commit -m "feat: scaffold static personal site"
```

---

### Task 2: Content Model And Homepage Sections

**Files:**
- Modify: `index.html`
- Modify: `tests/static-check.mjs`

**Interfaces:**
- Consumes: Section IDs from Task 1.
- Produces: Complete semantic homepage content for hero, problem statement, solutions, case, capability matrix, works, profile, and contact.

**Required user inputs before Step 3:**
- Public display name.
- Email address.
- WeChat display text.
- Four iOS App names, one-sentence descriptions, and App Store URLs.
- Public profile summary or resume excerpt.

- [ ] **Step 1: Extend tests for required copy and contact data**

Append these checks to `tests/static-check.mjs` before `console.log(...)`:

```javascript
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

const appStoreLinks = [...html.matchAll(/https:\/\/apps\.apple\.com\/[^"]+/g)];
assert.equal(appStoreLinks.length, 4, 'homepage must include exactly four App Store links');
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test
```

Expected: FAIL because the full copy, real email link, and four App Store links are not present.

- [ ] **Step 3: Replace scaffold sections with full homepage content**

Modify `index.html` so it contains:

```html
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__content">
    <p class="eyebrow">AI-Powered Operations Management</p>
    <h1 id="hero-title">运营管理智能自动化</h1>
    <p class="hero__subtitle">业务理解 × AI 工具 × 运营落地</p>
    <p class="hero__lead">帮助企业老板和管理团队识别可落地的 AI 场景，构建企业知识库、自动报告、数据分析看板和运营自动化 demo，让 AI 从概念进入真实业务流程。</p>
    <div class="hero__actions" aria-label="主要联系入口">
      <a class="button button--primary" href="#contact">微信联系</a>
      <a class="button button--secondary" href="mailto:USER_SUPPLIED_EMAIL">邮件交流</a>
    </div>
    <ul class="credential-list" aria-label="个人可信度标签">
      <li>工程管理硕士</li>
      <li>英语本科背景</li>
      <li>EPC / PMC / EPCm 项目经验</li>
      <li>项目控制与运营管理</li>
      <li>iOS App Store 上架开发者</li>
      <li>企业 AI 落地实践</li>
    </ul>
  </div>
</section>
```

Replace `USER_SUPPLIED_EMAIL` with the exact email provided by the user in this task. Do not use synthetic email addresses.

Add the remaining sections with these content blocks:

```html
<section id="problems" class="section section--statement" aria-labelledby="problems-title">
  <div class="section__inner">
    <p class="eyebrow">Business Gap</p>
    <h2 id="problems-title">企业 AI 落地的关键断层</h2>
    <p class="statement">企业真正需要的不是更多 AI 工具，而是能把 AI 接入真实业务流程、管理动作和组织执行的人。</p>
    <div class="insight-grid">
      <article><h3>IT 懂技术</h3><p>但常常不熟悉项目、合同、运营和管理报告里的真实业务细节。</p></article>
      <article><h3>业务懂问题</h3><p>但不知道如何把知识库、自动报告、数据分析和 AI 助手做成可执行方案。</p></article>
      <article><h3>落地需要桥梁</h3><p>从场景判断、数据结构、流程改造到演示系统，需要业务和 AI 共同进入同一张图。</p></article>
    </div>
  </div>
</section>
```

Use the user-provided display name, WeChat text, App Store data, and profile excerpt for `#work`, `#profile`, and `#contact`. Keep the section structure semantic:

```html
<section id="solutions" class="section" aria-labelledby="solutions-title">
  <div class="section__inner">
    <p class="eyebrow">Implementation Services</p>
    <h2 id="solutions-title">可落地的支持方向</h2>
    <div class="solution-grid">
      <article><h3>企业 AI 落地诊断</h3><p>梳理业务场景、优先级、可行性和实施路径。</p></article>
      <article><h3>企业知识库</h3><p>把制度、流程、合同和项目资料沉淀为可检索、可问答的知识系统。</p></article>
      <article><h3>自动报告</h3><p>围绕运营、项目、合同、财务或市场数据自动生成管理报告。</p></article>
      <article><h3>数据分析看板</h3><p>把经营、项目控制、费用、进度和回款等指标可视化。</p></article>
      <article><h3>本地大模型与私有化探索</h3><p>面向数据安全、离线运行和内部知识保护进行部署验证。</p></article>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Run the content tests to verify they pass**

Run:

```bash
npm test
```

Expected: PASS with all required copy, real email link, and four App Store links detected.

- [ ] **Step 5: Commit**

```bash
git add index.html tests/static-check.mjs
git commit -m "feat: add homepage content"
```

---

### Task 3: AOMS Screenshot Asset And Case Presentation

**Files:**
- Create: `assets/aoms-dashboard-clean.png`
- Modify: `index.html`
- Modify: `tests/static-check.mjs`

**Interfaces:**
- Consumes: Original user-provided screenshot at `/var/folders/x7/ypmpkn1j4qz24sbkbwjftfww0000gn/T/codex-clipboard-9b0e1df4-2615-4223-b827-aefb33352005.png`.
- Produces: Clean public case image referenced by `index.html`.

- [ ] **Step 1: Extend asset tests**

Replace the existing `node:fs` import in `tests/static-check.mjs` with:

```javascript
import { existsSync, readFileSync, statSync } from 'node:fs';
```

Add these checks before `console.log(...)`:

```javascript
assert.equal(existsSync('assets/aoms-dashboard-clean.png'), true, 'clean AOMS screenshot must exist');
assert.ok(statSync('assets/aoms-dashboard-clean.png').size > 100_000, 'clean AOMS screenshot should be a real image asset');
assert.match(html, /assets\/aoms-dashboard-clean\.png/, 'homepage must reference the clean AOMS screenshot');
assert.doesNotMatch(html, /codex-clipboard-9b0e1df4-2615-4223-b827-aefb33352005\.png/, 'homepage must not reference the temporary upload path');
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test
```

Expected: FAIL because `assets/aoms-dashboard-clean.png` does not exist and the case section does not reference it.

- [ ] **Step 3: Create the clean screenshot asset**

Use the image editing workflow:

1. Inspect the original screenshot with `view_image`.
2. Use `image_gen.imagegen` with the local screenshot as the referenced image.
3. Prompt: `Remove only the text "WOOD CHINA" and any visible "Wood China" brand text from the dashboard screenshot. Preserve the dashboard layout, colors, Chinese labels, charts, numbers, navigation, and all other UI details exactly. Do not invent new panels. Keep the image as a clean product screenshot.`
4. Save the edited result as `assets/aoms-dashboard-clean.png`.
5. Inspect `assets/aoms-dashboard-clean.png` visually and confirm that no “Wood China” text is visible.

- [ ] **Step 4: Add the case figure**

Modify the `#case-study` section in `index.html`:

```html
<section id="case-study" class="section section--case" aria-labelledby="case-title">
  <div class="section__inner">
    <div class="section-heading">
      <p class="eyebrow">Applied Demo</p>
      <h2 id="case-title">企业运营管理智能化 Demo</h2>
      <p>围绕合同、项目执行、市场商务、财务管理、知识库和 AI 助手，将运营数据、管理动作和 AI 能力整合到一个可演示的业务系统中。</p>
    </div>
    <figure class="case-figure">
      <button class="case-figure__button" type="button" data-dialog-target="aoms-dialog" aria-label="放大查看企业运营管理智能化 Demo 截图">
        <img src="assets/aoms-dashboard-clean.png" alt="自动化运营管理系统 AOMS 的数据看板、业务分类、滚动余额和运营模块截图">
      </button>
      <figcaption>Demo 展示合同、回款、业务分类、项目执行、知识库和 AI 助手等企业运营场景。</figcaption>
    </figure>
  </div>
</section>

<dialog class="image-dialog" id="aoms-dialog" aria-label="企业运营管理智能化 Demo 截图预览">
  <button class="image-dialog__close" type="button" data-dialog-close aria-label="关闭预览">关闭</button>
  <img src="assets/aoms-dashboard-clean.png" alt="">
</dialog>
```

- [ ] **Step 5: Run the tests and visually inspect**

Run:

```bash
npm test
```

Expected: PASS.

Then inspect `assets/aoms-dashboard-clean.png` and verify visually that the brand text is gone while the business dashboard remains recognizable.

- [ ] **Step 6: Commit**

```bash
git add assets/aoms-dashboard-clean.png index.html tests/static-check.mjs
git commit -m "feat: add cleaned AOMS case asset"
```

---

### Task 4: Visual System And Responsive Layout

**Files:**
- Modify: `styles.css`
- Modify: `tests/static-check.mjs`

**Interfaces:**
- Consumes: HTML class names and section structure from Tasks 2 and 3.
- Produces: Desktop and mobile layout, consulting-tech visual style, component states, and CSS guardrails.

- [ ] **Step 1: Add CSS guardrail tests**

Add these checks before `console.log(...)`:

```javascript
const css = read('styles.css');

for (const token of ['--ink', '--surface', '--accent-blue', '--accent-teal', '--accent-green', '--accent-warm']) {
  assert.match(css, new RegExp(token), `missing CSS design token ${token}`);
}

assert.match(css, /@media\s*\(max-width:\s*760px\)/, 'mobile breakpoint is required');
assert.doesNotMatch(css, /letter-spacing\s*:\s*-\d/, 'negative letter spacing is not allowed');
assert.doesNotMatch(css, /font-size\s*:\s*[^;]*vw/, 'viewport-width font sizing is not allowed');
assert.doesNotMatch(css, /border-radius\s*:\s*(?:9|[1-9]\d)px/, 'pixel border radii above 8px are not allowed');
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test
```

Expected: FAIL because the CSS design tokens and mobile breakpoint are not complete.

- [ ] **Step 3: Implement the visual system**

Replace `styles.css` with a complete stylesheet that includes these required foundations:

```css
:root {
  --ink: #172033;
  --muted: #5d6b82;
  --surface: #ffffff;
  --surface-soft: #f5f7fb;
  --line: #d9e1ec;
  --accent-blue: #2563eb;
  --accent-teal: #0f9ca8;
  --accent-green: #16a46a;
  --accent-warm: #c88a2a;
  --header: #0f1726;
  --shadow: 0 20px 60px rgba(23, 32, 51, 0.12);
  color: var(--ink);
  background: var(--surface-soft);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  color: var(--ink);
  background: var(--surface-soft);
}

a {
  color: inherit;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(16px);
}

.section {
  padding: 88px 24px;
}

.section__inner {
  width: min(1120px, 100%);
  margin: 0 auto;
}

.hero {
  min-height: 92vh;
  display: grid;
  align-items: center;
  padding: 112px 24px 72px;
  color: #ffffff;
  background:
    linear-gradient(120deg, rgba(15, 23, 38, 0.96), rgba(20, 58, 93, 0.92)),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px 80px),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px 80px);
}

.button,
.case-figure__button,
.image-dialog__close {
  border-radius: 8px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid transparent;
  font-weight: 700;
  text-decoration: none;
}

.button--primary {
  background: var(--accent-green);
  color: #ffffff;
}

.button--secondary {
  border-color: rgba(255, 255, 255, 0.42);
  color: #ffffff;
}

article,
.case-figure,
.contact-panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

@media (max-width: 760px) {
  .section {
    padding: 64px 18px;
  }

  .hero {
    min-height: auto;
    padding: 96px 18px 56px;
  }
}
```

Extend the stylesheet so that:
- Navigation is compact and scannable on desktop and wraps cleanly on mobile.
- Hero content uses constrained width and leaves a hint of the next section on desktop.
- `.insight-grid`, `.solution-grid`, capability cards, and work cards use responsive CSS grid.
- The AOMS screenshot is large, sharp, and contained without cropping.
- Contact methods are clear, high contrast, and easy to scan.
- Focus states use visible outlines.

- [ ] **Step 4: Run CSS tests**

Run:

```bash
npm test
```

Expected: PASS with CSS guardrails satisfied.

- [ ] **Step 5: Commit**

```bash
git add styles.css tests/static-check.mjs
git commit -m "feat: style personal AI operations site"
```

---

### Task 5: Lightweight Interaction And Accessibility

**Files:**
- Modify: `script.js`
- Modify: `index.html`
- Modify: `tests/static-check.mjs`

**Interfaces:**
- Consumes: Navigation anchors, `#aoms-dialog`, `data-dialog-target`, and `data-dialog-close` from earlier tasks.
- Produces: Progressive enhancement for smooth navigation, active nav state, reveal effects, image dialog, and text copy buttons.

- [ ] **Step 1: Add interaction tests**

Add these checks before `console.log(...)`:

```javascript
const js = read('script.js');

for (const marker of ['initSmoothScroll', 'initActiveNavigation', 'initRevealOnScroll', 'initImageDialog', 'initCopyButtons']) {
  assert.match(js, new RegExp(marker), `missing JavaScript initializer ${marker}`);
}

assert.match(html, /data-dialog-target="aoms-dialog"/, 'case image must open the AOMS dialog');
assert.match(html, /data-dialog-close/, 'image dialog must have a close control');
assert.match(html, /aria-label="主导航"/, 'main navigation needs an accessible label');
assert.match(html, /data-copy-value=/, 'contact section should expose copyable contact text');
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test
```

Expected: FAIL because `script.js` does not yet include the required initializers and contact copy buttons.

- [ ] **Step 3: Add copy controls to the contact section**

In `#contact`, include contact rows using exact user-supplied values:

```html
<div class="contact-methods" aria-label="联系方式">
  <article class="contact-card">
    <h3>微信</h3>
    <p>适合企业 AI 落地诊断、业务场景 demo 共创、合作与创业交流。</p>
    <button class="copy-button" type="button" data-copy-value="USER_SUPPLIED_WECHAT">复制微信</button>
  </article>
  <article class="contact-card">
    <h3>邮箱</h3>
    <p><a href="mailto:USER_SUPPLIED_EMAIL">USER_SUPPLIED_EMAIL</a></p>
    <button class="copy-button" type="button" data-copy-value="USER_SUPPLIED_EMAIL">复制邮箱</button>
  </article>
</div>
```

Replace both `USER_SUPPLIED_WECHAT` and `USER_SUPPLIED_EMAIL` with exact user-provided contact values before running the test.

- [ ] **Step 4: Implement progressive enhancement**

Replace `script.js` with:

```javascript
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
};

const initActiveNavigation = () => {
  const links = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.toggleAttribute('aria-current', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => observer.observe(section));
};

const initRevealOnScroll = () => {
  const revealItems = [...document.querySelectorAll('.reveal')];
  if (!('IntersectionObserver' in window) || revealItems.length === 0) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
};

const initImageDialog = () => {
  document.querySelectorAll('[data-dialog-target]').forEach((trigger) => {
    const dialog = document.getElementById(trigger.dataset.dialogTarget);
    if (!dialog) return;

    trigger.addEventListener('click', () => {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      }
    });
  });

  document.querySelectorAll('[data-dialog-close]').forEach((button) => {
    button.addEventListener('click', () => {
      button.closest('dialog')?.close();
    });
  });
};

const initCopyButtons = () => {
  document.querySelectorAll('[data-copy-value]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.getAttribute('data-copy-value');
      if (!value || !navigator.clipboard) return;
      await navigator.clipboard.writeText(value);
      button.textContent = '已复制';
      window.setTimeout(() => {
        button.textContent = button.dataset.copyLabel || '复制';
      }, 1600);
    });
    button.dataset.copyLabel = button.textContent;
  });
};

document.documentElement.classList.add('js-ready');
initSmoothScroll();
initActiveNavigation();
initRevealOnScroll();
initImageDialog();
initCopyButtons();
```

- [ ] **Step 5: Run tests**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add index.html script.js tests/static-check.mjs
git commit -m "feat: add static site interactions"
```

---

### Task 6: README And End-To-End Verification

**Files:**
- Create: `README.md`
- Modify: `tests/static-check.mjs`

**Interfaces:**
- Consumes: Completed static site from Tasks 1-5.
- Produces: Local usage documentation and final verification evidence.

- [ ] **Step 1: Add final quality tests**

Add these checks before `console.log(...)`:

```javascript
assert.match(html, /<main>/, 'page must have a main landmark');
assert.match(html, /<h1[^>]*>运营管理智能自动化<\/h1>/, 'homepage must have one clear h1');
assert.match(html, /alt="[^"]{12,}"/, 'meaningful image alt text is required');
assert.doesNotMatch(html, /<form\b/i, 'static first version must not include forms');
assert.doesNotMatch(html, /\b(login|database|booking|pricing)\b/i, 'excluded product surface should not appear in first version HTML');
```

- [ ] **Step 2: Run the test to verify current result**

Run:

```bash
npm test
```

Expected: PASS. If a check fails, fix the named file and rerun the same command.

- [ ] **Step 3: Create README**

Create `README.md`:

````markdown
# 运营管理智能自动化个人网站

静态个人主页，面向企业老板、高管、潜在客户和合作伙伴，展示业务理解、工程管理、运营管理和 AI 落地实践。

## 本地查看

直接打开 `index.html`，或运行：

```bash
npm run serve
```

然后访问 `http://localhost:4173`。

## 验证

```bash
npm test
```

## 内容更新

- 首页内容在 `index.html` 中维护。
- 样式在 `styles.css` 中维护。
- 轻量交互在 `script.js` 中维护。
- 案例截图、头像和二维码放在 `assets/`。
````

- [ ] **Step 4: Run automated verification**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: Run local browser verification**

Run:

```bash
npm run serve
```

Open `http://localhost:4173` and verify:
- Desktop layout has no overlapping text or broken navigation.
- Mobile width around 390px stacks cards cleanly.
- AOMS screenshot is large enough to identify the business system.
- “Wood China” is not visible in the displayed case image.
- WeChat and email contact entries are visible.
- Four App Store links open their destination URLs.

Stop the static server after verification.

- [ ] **Step 6: Commit**

```bash
git add README.md tests/static-check.mjs
git commit -m "docs: add static site usage notes"
```

---

## Self-Review Notes

- Spec coverage: Tasks cover static structure, Chinese-first copy, contact conversion, AOMS screenshot cleaning, capability and work sections, visual direction, lightweight interactions, responsive requirements, and validation criteria.
- Scope: The plan stays within a one-page static site and excludes blog, backend, booking, database, login, pricing, and multilingual switcher.
- Dependency check: The plan uses only browser-native APIs, Node.js built-in modules, and Python’s built-in HTTP server for local viewing.
- Content risk: Public name, email, WeChat value, personal photo, and App Store links must come from the user rather than inference.
