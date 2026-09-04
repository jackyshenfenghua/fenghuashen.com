import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const textExists = (html, text) => new RegExp(escapeRegExp(text)).test(html);

for (const path of ['index.html', 'styles.css', 'script.js']) {
  assert.equal(existsSync(path), true, `${path} must exist`);
}

const html = read('index.html');
const css = read('styles.css');
const js = read('script.js');

assert.match(html, /<html lang="en">/, 'document language must be English');
assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1\.0">/, 'mobile viewport meta is required');
assert.match(html, /<title>Jacky Shen \| Project Management, Operations &amp; AI<\/title>/, 'English SEO title is required and must escape ampersands');
assert.match(html, /<meta name="description" content="Jacky Shen is a PMP-certified project and operations professional with 20\+ years of experience in project management and project controls, with hands-on exploration of AI, automation and digital products\.">/, 'English meta description is required');
assert.match(html, /property="og:title"/, 'Open Graph title is required');
assert.match(html, /property="og:description"/, 'Open Graph description is required');
assert.match(html, /property="og:type" content="profile"/, 'Open Graph profile type is required');
assert.match(html, /name="twitter:card" content="summary"/, 'Twitter card metadata is required');
assert.match(html, /rel="icon" href="favicon\.svg" type="image\/svg\+xml"/, 'favicon link is required');
assert.equal([...html.matchAll(/&(?![a-zA-Z][a-zA-Z0-9]+;|#[0-9]+;|#x[0-9A-Fa-f]+;)/g)].length, 0, 'HTML source must not contain unescaped ampersands');
assert.doesNotMatch(html, /rel="canonical"|example\.com|localhost|127\.0\.0\.1/, 'fake canonical or placeholder domains must not appear');
assert.match(html, /<script type="application\/ld\+json">[\s\S]*"@type": "Person"[\s\S]*"name": "Jacky Shen"/, 'Person structured data is required');
const structuredData = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.deepEqual(structuredData.sameAs, ['https://www.linkedin.com/in/jacky-shen-pmp-b17bb22b'], 'LinkedIn sameAs is required');
assert.doesNotMatch(html, /"employer"|"address"|"identifier"|"alumniOf"/, 'structured data must not include unconfirmed facts');

for (const id of ['home', 'experience', 'expertise', 'tools', 'featured-project', 'products', 'about', 'credentials', 'contact']) {
  assert.match(html, new RegExp(`id="${id}"`), `missing section #${id}`);
}

for (const navText of ['Experience', 'Expertise', 'Projects', 'Products', 'About', 'Contact']) {
  assert.match(html, new RegExp(`>${escapeRegExp(navText)}<`), `missing English navigation item: ${navText}`);
}

const primaryNav = html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/)?.[0] || '';
for (const removedNav of ['首页', '方案', '案例', '作品', '联系', 'Solutions', 'Case', 'Work']) {
  assert.equal(textExists(primaryNav, removedNav), false, `old navigation copy must be removed: ${removedNav}`);
}

for (const requiredText of [
  'Jacky Shen',
  'Project · Operations · Applied AI',
  'PROJECTS · OPERATIONS · APPLIED AI',
  'Project Management.',
  'Operations. Applied AI.',
  'Project Management × Operations × Applied AI',
  "I bring 20+ years of experience in project management and project controls across complex project environments. Today, I'm extending that experience into operations, AI-assisted workflows, automation and digital products.",
  'PMP®',
  'Project Management Professional',
  'Project Management Institute (PMI)',
  '20+ Years',
  'EPC · PMC · EPCm',
  'Primavera P3 / P6',
  'Built on Real-World Projects',
  'Project Controls · Risk Management · Commercial · Finance · Corporate Governance',
  'with responsibilities that later expanded into operations, commercial management, finance and corporate governance.',
  'Scheduling · Progress · Cost Control · Contracts · Reporting',
  'Project planning, scheduling, progress management, cost control, contracts, commercial controls, payment and collection-related controls, and management reporting across complex project environments.',
  'Project Risk &amp; Commercial Management',
  'Experience across the project risk management cycle and adjacent commercial controls, including risk identification, qualitative and quantitative analysis, risk response planning, contingency management, contracts, payments and collections.',
  'Risk Identification',
  'Qualitative Risk Analysis',
  'Quantitative Risk Analysis',
  'Risk Response Planning',
  'Contingency Management',
  'Finance, Business &amp; Governance',
  "Concurrently serving as Finance Director, with responsibility for the company's finance function, including financial management, taxation, banking and budgeting, as well as financial and operational reporting to the Board.",
  'Since 2023, also serving concurrently as Board Secretary, supporting Board governance through meeting coordination, minutes and preparation of Board resolutions.',
  'That foundation has broadened into additional management responsibilities in finance and corporate governance, including serving concurrently as Finance Director and, since 2023, as Board Secretary.',
  'Finance Director',
  'Financial Management',
  'Taxation',
  'Banking',
  'Budgeting',
  'Board Reporting',
  'Board Secretary',
  'Corporate Governance',
  'Board Coordination',
  'Board Minutes',
  'Board Resolutions',
  'Hands-on exploration of AI-assisted workflows, enterprise knowledge systems, automated reporting, analytics, local/private LLM exploration and digital product prototyping.',
  'Primavera P3 and Primavera P6 used in real project environments, including nuclear power and chemical projects.',
  'PDCA',
  'A3 Problem Solving',
  'AI-Powered Operations Management System',
  'project controls, commercial activity, finance, management workflows, analytics, enterprise knowledge and AI assistance',
  'Operational information is often distributed across project execution, contracts, commercial activities, finance, management reporting and internal knowledge.',
  'finance and operational reporting, analytics, knowledge retrieval and AI-assisted capabilities',
  'Representative demo interface using synthetic data. No client or confidential information is shown.',
  'AOMS',
  'From Ideas to Working Products',
  'Senior Engineer',
  'Professional Technical Title, China',
  "A formally recognized senior-level professional engineering title within China's professional and technical qualification system.",
  'Master’s Degree',
  'Engineering Management',
  'LinkedIn',
  'Connect on LinkedIn ↗',
  'Email Jacky',
  'fenghua.shen@163.com',
  'Project Management · Operations · Applied AI',
  '© 2026 Jacky Shen'
]) {
  assert.match(html, new RegExp(escapeRegExp(requiredText)), `missing required international portfolio copy: ${requiredText}`);
}

for (const preservedCapabilityText of [
  'AI-assisted workflows',
  'AI Tools',
  'AI Assistant',
  'AI-Powered Operations Management System',
  'AI &amp; Digital Exploration',
  'AI applications'
]) {
  assert.match(html, new RegExp(escapeRegExp(preservedCapabilityText)), `capability/project AI wording must remain unchanged: ${preservedCapabilityText}`);
}

for (const oldPositioningText of [
  'Project · Operations · AI',
  'PROJECTS · OPERATIONS · AI',
  'Operations. AI.',
  'Project Management × Operations × AI',
  'Project Management · Operations · AI'
]) {
  assert.equal(textExists(html, oldPositioningText), false, `old generic AI positioning copy must be replaced: ${oldPositioningText}`);
}

for (const forbiddenText of [
  '微信',
  'WeChat',
  '心理咨询师',
  '高级疗愈师',
  '企业 AI 落地诊断',
  '企业真正需要的不是更多 AI 工具',
  'IT 懂技术',
  '业务懂问题',
  '落地需要桥梁',
  'Cost Awareness',
  'Professional Technical Qualification, China',
  'Finance &amp; Business Management',
  'Serving concurrently as Board Secretary since 2023',
  'concurrent Finance Director responsibility for the finance function and, since 2023, Board Secretary work supporting governance processes',
  'local/private LLM deployment',
  'AI Expert',
  'AI Consultant',
  'AI Engineer',
  'Machine Learning Engineer',
  'Chief Financial Officer',
  'CFO',
  'Corporate Secretary',
  'Company Secretary',
  'General Counsel',
  'Governance Officer',
  'Professional Engineer (PE)',
  'Chartered Engineer',
  'Licensed Engineer',
  'Enterprise AI Transformation Expert',
  'machine-learning engineer',
  'software engineer',
  'enterprise AI transformation veteran'
]) {
  assert.equal(textExists(html, forbiddenText), false, `forbidden first-version international copy remains: ${forbiddenText}`);
}

for (const forbiddenScriptText of ['复制', '已复制', '复制失败']) {
  assert.equal(textExists(js, forbiddenScriptText), false, `copy interaction text must be English: ${forbiddenScriptText}`);
}

assert.match(html, /mailto:fenghua\.shen@163\.com/, 'confirmed email must be preserved');
assert.match(html, /data-copy-value="fenghua\.shen@163\.com"/, 'email should remain copyable');
assert.equal([...html.matchAll(/data-copy-value=/g)].length, 1, 'only email should expose a copy value');
assert.match(html, /href="https:\/\/www\.linkedin\.com\/in\/jacky-shen-pmp-b17bb22b"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[^>]*>Connect on LinkedIn ↗<\/a>/, 'LinkedIn contact link must open safely in a new tab');
for (const externalLink of [...html.matchAll(/<a href="https:\/\/[^"]+"[^>]*>/g)].map((match) => match[0])) {
  assert.match(externalLink, /target="_blank"/, `external link must open in a new tab: ${externalLink}`);
  assert.match(externalLink, /rel="noopener noreferrer"/, `external link must use safe rel attributes: ${externalLink}`);
}

const appStoreLinks = [...html.matchAll(/https:\/\/apps\.apple\.com\/[^\"]+/g)];
assert.equal(appStoreLinks.length, 4, 'homepage must include exactly four App Store links');
for (const product of ['Paw Diary', 'Zen Flow', 'Siply', 'Liminal']) {
  assert.match(html, new RegExp(escapeRegExp(product)), `missing product: ${product}`);
}
assert.equal([...html.matchAll(/View on the App Store/g)].length, 4, 'each product should use the English App Store CTA');

assert.equal(existsSync('assets/aoms-dashboard-clean.png'), true, 'clean AOMS screenshot must exist');
assert.ok(statSync('assets/aoms-dashboard-clean.png').size > 100_000, 'clean AOMS screenshot should be a real image asset');
assert.match(html, /assets\/aoms-dashboard-clean\.png/, 'homepage must reference the clean AOMS screenshot');
assert.doesNotMatch(html, /Wood China/i, 'public HTML must not include Wood China');

for (const asset of [
  'assets/profile-photo.jpg',
  'assets/app-paw-diary.jpg',
  'assets/app-zen-flow.jpg',
  'assets/app-siply.jpg',
  'assets/app-liminal.jpg'
]) {
  assert.equal(existsSync(asset), true, `${asset} must exist`);
  assert.ok(statSync(asset).size > 20_000, `${asset} should be a real image asset`);
  assert.match(html, new RegExp(escapeRegExp(asset)), `homepage must reference ${asset}`);
}

assert.match(html, /<a class="skip-link" href="#main">Skip to content<\/a>/, 'skip link is required');
assert.match(html, /<main id="main">/, 'page must have a main landmark target');
assert.match(html, /aria-label="Primary navigation"/, 'main navigation needs an English accessible label');
assert.equal([...html.matchAll(/<h1[\s>]/g)].length, 1, 'homepage must have exactly one semantic h1');
const h1Markup = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/)[0];
assert.match(h1Markup, /Project Management\.[\s\S]*Operations\. Applied AI\./, 'h1 must carry the visual headline');
assert.equal(/Jacky Shen/.test(h1Markup), false, 'Jacky Shen should be outside the h1 as the hero name label');
assert.match(html, /class="hero__name">Jacky Shen<\/p>/, 'hero name label should remain visible outside h1');
assert.match(html, /data-dialog-target="aoms-dialog"/, 'featured project image must keep the AOMS dialog');
assert.match(html, /data-dialog-close/, 'image dialog must have a close control');
assert.match(html, /alt="[^"]{12,}"/, 'meaningful image alt text is required');
assert.match(html, /<footer class="site-footer"/, 'restrained footer is required');
assert.doesNotMatch(html, /<form\b/i, 'static portfolio must not include forms');
assert.doesNotMatch(html, /\b(login|database|pricing)\b/i, 'excluded product surface should not appear in first version HTML');
assert.doesNotMatch(html, /AI Expert|AI Guru|AI agency|AI consulting company|software engineer/g, 'overstated AI/software positioning must not appear');

for (const marker of ['initSmoothScroll', 'initActiveNavigation', 'initRevealOnScroll', 'initImageDialog', 'initCopyButtons']) {
  assert.match(js, new RegExp(marker), `missing JavaScript initializer ${marker}`);
}
assert.match(js, /href\s*===\s*['"]#home['"][\s\S]*?window\.scrollTo\(\{\s*top:\s*0,/, 'home navigation must scroll to the document top');
assert.match(html, /<script src="script\.js\?v=20260901"><\/script>/, 'script URL needs a version parameter so browser cache cannot preserve old interaction copy');

for (const token of ['--ink', '--surface', '--accent-blue', '--accent-teal', '--accent-green', '--accent-warm']) {
  assert.match(css, new RegExp(token), `missing CSS design token ${token}`);
}
assert.match(css, /@media\s*\(max-width:\s*1024px\)/, 'laptop/tablet breakpoint is required');
assert.match(css, /@media\s*\(max-width:\s*760px\)/, 'mobile breakpoint is required');
assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?html\s*\{\s*scroll-behavior:\s*auto;/, 'reduced-motion media query must disable smooth html scrolling');
assert.match(css, /\.site-nav\s+a\[aria-current\]/, 'current navigation links need a visible CSS state');
assert.match(css, /\.hero-proof img\s*\{[^}]*object-fit:\s*contain;[^}]*object-position:\s*center top;/, 'hero portrait must preserve the top of the head');
assert.match(css, /\.work-card__media\s*\{[^}]*aspect-ratio:\s*3\s*\/\s*4;/, 'product images should use the portrait App Store artwork ratio');
assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*?\.site-nav\s*\{[^}]*flex-wrap:\s*nowrap;[^}]*overflow-x:\s*auto;/, 'mobile navigation should remain compact without page overflow');
assert.doesNotMatch(css, /\.card-kicker\s*\{[^}]*text-transform:\s*uppercase;/, 'card kickers should not force EPCm into EPCM');
assert.doesNotMatch(css, /letter-spacing\s*:\s*-\d/, 'negative letter spacing is not allowed');
assert.doesNotMatch(css, /font-size\s*:\s*[^;]*vw/, 'viewport-width font sizing is not allowed');
assert.doesNotMatch(css, /border-radius\s*:\s*(?:9|[1-9]\d)px/, 'pixel border radii above 8px are not allowed');

assert.equal(existsSync('robots.txt'), true, 'robots.txt is required');
const robots = read('robots.txt');
assert.match(robots, /User-agent:\s*\*/, 'robots.txt must define user-agent');
assert.match(robots, /Allow:\s*\//, 'robots.txt must allow the static site');
assert.doesNotMatch(robots, /Sitemap:\s*https?:\/\//, 'robots.txt must not invent a sitemap URL');
assert.equal(existsSync('sitemap.xml'), false, 'sitemap.xml should wait for a real production domain');

console.log('International portfolio static checks passed.');
