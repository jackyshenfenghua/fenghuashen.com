import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const textExists = (html, text) => new RegExp(escapeRegExp(text)).test(html);

for (const path of ['index.html', 'styles.css', 'script.js', 'robots.txt']) {
  assert.equal(existsSync(path), true, `${path} must exist`);
}

const html = read('index.html');
const css = read('styles.css');
const js = read('script.js');
const privacyPath = 'can-your-pet/privacy/index.html';
const supportPath = 'can-your-pet/support/index.html';

assert.match(html, /<html lang="en">/, 'document language must be English');
assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1\.0">/, 'mobile viewport meta is required');
assert.match(html, /<title>Jacky Shen \| Project Management, Operations &amp; Applied AI<\/title>/, 'English SEO title is required and must escape ampersands');
assert.match(html, /<meta name="description" content="PMP®-credentialed project and operations professional with 20\+ years of experience in project management and project controls, extending into Applied AI and automation\.">/, 'English meta description must emphasize professional foundation before Applied AI');
assert.equal([...html.matchAll(/<link rel="canonical" href="https:\/\/fenghuashen\.com\/">/g)].length, 1, 'exactly one HTTPS canonical link is required');
assert.match(html, /<meta property="og:title" content="Jacky Shen \| Project Management, Operations &amp; Applied AI">/, 'Open Graph title must align with page title');
assert.match(html, /<meta property="og:description" content="PMP®-credentialed project and operations professional with 20\+ years of experience in project management and project controls, extending into Applied AI and automation\.">/, 'Open Graph description must preserve the positioning hierarchy');
assert.match(html, /<meta property="og:url" content="https:\/\/fenghuashen\.com\/">/, 'Open Graph URL must use the canonical HTTPS homepage');
assert.match(html, /property="og:type" content="profile"/, 'Open Graph profile type is required');
assert.match(html, /name="twitter:card" content="summary"/, 'Twitter card metadata is required');
assert.match(html, /<meta name="twitter:title" content="Jacky Shen \| Project Management, Operations &amp; Applied AI">/, 'Twitter title must align with page title');
assert.match(html, /<meta name="twitter:description" content="PMP®-credentialed project and operations professional with 20\+ years of experience in project management and project controls, extending into Applied AI and automation\.">/, 'Twitter description must preserve the positioning hierarchy');
assert.match(html, /rel="icon" href="favicon\.svg" type="image\/svg\+xml"/, 'favicon link is required');
assert.equal([...html.matchAll(/&(?![a-zA-Z][a-zA-Z0-9]+;|#[0-9]+;|#x[0-9A-Fa-f]+;)/g)].length, 0, 'HTML source must not contain unescaped ampersands');
assert.doesNotMatch(html, /example\.com|localhost|127\.0\.0\.1|http:\/\/fenghuashen\.com|https?:\/\/www\.fenghuashen\.com|jackyshenfenghua\.github\.io|netlify\.app/, 'fake, non-canonical, preview, or old hosting SEO URLs must not appear');
assert.equal(textExists(html, 'Can Your Pet'), false, 'homepage must not mention Can Your Pet');
assert.doesNotMatch(html, /noindex|nofollow|X-Robots-Tag/i, 'indexing blockers must not appear in the homepage source');
assert.match(html, /<script type="application\/ld\+json">[\s\S]*"@type": "Person"[\s\S]*"name": "Jacky Shen"/, 'Person structured data is required');
const structuredData = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.equal(structuredData.url, 'https://fenghuashen.com/', 'Person structured data should include the canonical HTTPS identity URL');
assert.equal(structuredData.description, 'PMP®-credentialed project and operations professional with 20+ years of experience in project management and project controls, extending into Applied AI and automation.', 'Person structured data description must align with the V1.3 positioning hierarchy');
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

const robots = read('robots.txt');
assert.match(robots, /User-agent:\s*\*/, 'robots.txt must define user-agent');
assert.match(robots, /Allow:\s*\//, 'robots.txt must allow the static site');
assert.match(robots, /Sitemap:\s*https:\/\/fenghuashen\.com\/sitemap\.xml/, 'robots.txt must declare the canonical sitemap URL');
assert.doesNotMatch(robots, /Disallow:\s*\//, 'robots.txt must not block public content');

assert.equal(existsSync('sitemap.xml'), true, 'sitemap.xml is required now that the production domain is live');
const sitemap = read('sitemap.xml');
assert.equal(
  sitemap.trim(),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://fenghuashen.com/</loc>
  </url>
</urlset>`,
  'sitemap.xml must be a minimal canonical homepage sitemap'
);
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual(sitemapUrls, ['https://fenghuashen.com/'], 'sitemap must include only the canonical homepage URL');
for (const url of sitemapUrls) {
  assert.doesNotMatch(url, /#|http:\/\/|https?:\/\/www\.fenghuashen\.com|github\.io|netlify\.app/i, 'sitemap URLs must not include fragments or non-canonical hosts');
}
assert.doesNotMatch(sitemap, /changefreq|priority|lastmod/i, 'sitemap must not include arbitrary metadata');

assert.equal(read('CNAME').trim(), 'fenghuashen.com', 'custom domain CNAME must remain unchanged');
for (const appPagePath of [privacyPath, supportPath]) {
  assert.equal(existsSync(appPagePath), true, `${appPagePath} must exist for direct GitHub Pages routing`);
}

const privacyHtml = read(privacyPath);
const supportHtml = read(supportPath);
const appPages = `${privacyHtml}\n${supportHtml}`;

assert.match(privacyHtml, /<html lang="en">/, 'Can Your Pet privacy page language must be English');
assert.match(supportHtml, /<html lang="en">/, 'Can Your Pet support page language must be English');
assert.match(privacyHtml, /<title>Can Your Pet — Privacy Policy<\/title>/, 'privacy page title is required');
assert.match(supportHtml, /<title>Can Your Pet — Support<\/title>/, 'support page title is required');
assert.match(privacyHtml, /<meta name="description" content="Privacy information for the Can Your Pet mobile app\.">/, 'privacy page meta description is required');
assert.match(supportHtml, /<meta name="description" content="Support and contact information for the Can Your Pet mobile app\.">/, 'support page meta description is required');
assert.match(privacyHtml, /<link rel="canonical" href="https:\/\/fenghuashen\.com\/can-your-pet\/privacy\/">/, 'privacy page canonical URL is required');
assert.match(supportHtml, /<link rel="canonical" href="https:\/\/fenghuashen\.com\/can-your-pet\/support\/">/, 'support page canonical URL is required');
assert.match(privacyHtml, /<link rel="stylesheet" href="..\/..\/styles\.css">/, 'privacy page must reuse the existing stylesheet');
assert.match(supportHtml, /<link rel="stylesheet" href="..\/..\/styles\.css">/, 'support page must reuse the existing stylesheet');

for (const appPageHtml of [privacyHtml, supportHtml]) {
  assert.match(appPageHtml, /<a class="skip-link" href="#main">Skip to content<\/a>/, 'standalone app pages need a skip link');
  assert.match(appPageHtml, /<main id="main"/, 'standalone app pages need a main landmark target');
  assert.equal([...appPageHtml.matchAll(/&(?![a-zA-Z][a-zA-Z0-9]+;|#[0-9]+;|#x[0-9A-Fa-f]+;)/g)].length, 0, 'standalone app pages must not contain unescaped ampersands');
  assert.doesNotMatch(appPageHtml, /href="(?:\/|..\/..\/index\.html|https:\/\/fenghuashen\.com\/")/, 'standalone app pages must not link back to the personal homepage');
}

for (const requiredPrivacyText of [
  'Privacy Policy',
  'Last updated: September 28, 2026',
  'Can Your Pet is a pet behavior discovery app that lets you compare your pet’s everyday behaviors with other participating pets.',
  'This Privacy Policy explains what information the app collects, how it is used, and what is not collected.',
  'Information We Collect',
  'Pet information',
  'Pet species, currently Dog or Cat',
  'An optional pet name',
  'An optional pet photo, stored locally on your device',
  'App usage information',
  'Pet names are not included in usage analytics.',
  'Anonymous account identifier',
  'How We Use Information',
  'Information We Do Not Collect',
  'Photos',
  'The current version also does not include user-generated public posts, comments, direct messages, or public social profiles.',
  'Sharing',
  'Community Statistics',
  'Data Security',
  'Data Retention and Deletion',
  'https://fenghuashen.com/can-your-pet/support/',
  'Children',
  'Changes to This Policy',
  'Contact',
  '© 2026 Can Your Pet'
]) {
  assert.match(privacyHtml, new RegExp(escapeRegExp(requiredPrivacyText)), `missing required privacy page copy: ${requiredPrivacyText}`);
}

assert.doesNotMatch(privacyHtml, /<li>photo library access<\/li>/, 'privacy page must not broadly claim that photo-library access is never requested');
assert.doesNotMatch(privacyHtml, /does not access your existing photos/i, 'privacy page must not deny access to a photo explicitly selected by the user');
assert.doesNotMatch(privacyHtml, /<li>camera access<\/li>/, 'privacy page must not claim that camera access is never requested');
assert.doesNotMatch(privacyHtml, /photos are only written, never selected/i, 'privacy page must not claim that photos can never be selected');

for (const [pattern, message] of [
  [/<h2>Suggest a Quirk<\/h2>/, 'privacy page must disclose Suggest a Quirk'],
  [/voluntarily submit free-text describing a pet behavior/, 'privacy page must describe voluntary free-text quirk submissions'],
  [/suggestion is private/, 'privacy page must state that quirk suggestions are private'],
  [/not automatically made public/, 'privacy page must state that suggestions are not automatically public'],
  [/not automatically[^<]*published as a Challenge/, 'privacy page must state that suggestions are not automatically published as Challenges'],
  [/not automatically[^<]*shown to other users/, 'privacy page must state that suggestions are not automatically shown to other users'],
  [/editorial purposes[^<]*duplicate or similar behaviors[^<]*future challenge design/, 'privacy page must explain the limited Suggest a Quirk review purposes'],
  [/<h2>Deleting a Pet<\/h2>/, 'privacy page must explain Delete Pet behavior'],
  [/permanently removes the pet profile and pet-linked data/, 'privacy page must state that Delete Pet removes pet-linked data'],
  [/identifiable Style Check progress and responses/, 'privacy page must include identifiable Style Check data in Delete Pet'],
  [/private Suggest a Quirk submissions/, 'privacy page must include private suggestions in Delete Pet'],
  [/stored app progress and related pet-specific state/, 'privacy page must include pet-specific app state in Delete Pet'],
  [/aggregate community insights based on behavior responses/, 'privacy page must describe response-based community statistics'],
  [/individual challenge-level YES\s*\/\s*NOPE behavior contributions in de-identified form/, 'privacy page must disclose de-identified YES/NOPE retention'],
  [/do not contain an account or owner ID/, 'privacy page must exclude account linkage from retained statistical records'],
  [/stable identifier linking multiple responses to the deleted pet/, 'privacy page must exclude stable pet-response linkage from retained statistical records'],
  [/not linked to your account or deleted pet in the application data model/, 'privacy page must describe the application-data-model separation'],
  [/do not retain the deleted pet’s Style Check profile or Behavior Style result/, 'privacy page must exclude deleted Behavior Style retention'],
  [/cannot later identify which records came from that pet for selective removal/, 'privacy page must disclose the selective-removal limitation'],
  [/Deleting a pet does not delete other account-level data\./, 'privacy page must state the account-level deletion boundary'],
  [/Apple’s system photo picker/, 'privacy page must explain the Apple system photo picker'],
  [/receives only the image you select/, 'privacy page must limit photo access to the explicitly selected image'],
  [/does not browse your photo library/, 'privacy page must preserve the photo-library browse limitation'],
  [/does not browse your photo library or request broad photo-library read access/, 'privacy page must exclude browsing and broad photo-library read permission'],
  [/Take Photo[^<]*requests camera access only for the photo capture you initiate/, 'privacy page must explain user-initiated camera access'],
  [/camera is not used continuously or in the background/, 'privacy page must exclude continuous or background camera use'],
  [/resized and re-encoded for use in the app/, 'privacy page must explain local image normalization'],
  [/does not intentionally retain[^<]*EXIF or GPS metadata/, 'privacy page must explain the restrained metadata boundary'],
  [/Pet photos are stored locally on your device/, 'privacy page must state local-only pet-photo storage'],
  [/not uploaded to Can Your Pet’s cloud service or synchronized through the Can Your Pet backend/, 'privacy page must exclude pet-photo cloud upload and backend synchronization'],
  [/not used for Behavior Style calculations[^<]*behavior inference[^<]*community statistics[^<]*analytics[^<]*advertising[^<]*AI analysis/, 'privacy page must state the pet-photo use boundaries'],
  [/remove a pet photo[^<]*locally stored photo is deleted[^<]*pet profile and behavior data remain/i, 'privacy page must distinguish Remove Photo from Delete Pet'],
  [/Deleting a pet also removes that pet’s locally stored photo/, 'privacy page must include the local photo in Delete Pet'],
  [/deletion-recovery process retries the cleanup[^<]*cannot be restored through synchronization/, 'privacy page must explain interrupted photo cleanup and no resurrection'],
  [/Pet photos are not part of this de-identified statistical retention/, 'privacy page must exclude photos from statistical retention'],
  [/No pet-photo image, filename, thumbnail, photo hash, or photo metadata is retained/, 'privacy page must exclude photo artifacts from retained statistics'],
  [/Save Image[^<]*separate from selecting an existing pet photo through Apple’s system photo picker/, 'privacy page must distinguish Save Image from selecting a pet photo'],
  [/Save Image uses add-only Photos access/, 'privacy page must preserve the Share Card add-only disclosure'],
  [/generated Share Card may include the pet photo stored locally on your device/, 'privacy page must disclose that a generated Share Card may include the local pet photo'],
  [/Share Card is rendered locally on your device/, 'privacy page must disclose local Share Card rendering'],
  [/only when you explicitly choose to create, share, or save it/, 'privacy page must require explicit action for Share Card creation, sharing, or saving'],
  [/does not automatically upload either the source pet photo or the generated Share Card to Can Your Pet’s cloud service/, 'privacy page must exclude automatic source-photo and Share Card cloud upload'],
  [/iOS presents the system share sheet[^<]*you choose the destination/, 'privacy page must explain the system share sheet and user-selected destination'],
  [/Pet photos and Share Card factual content are not sent to analytics/, 'privacy page must preserve the Share Card analytics boundary'],
  [/https:\/\/fenghuashen\.com\/can-your-pet\/support\//, 'privacy page must preserve the Support contact path']
]) {
  assert.match(privacyHtml, pattern, message);
}

assert.doesNotMatch(privacyHtml, /Current generated Share Cards do not include the pet photo/, 'privacy page must remove the obsolete Share Card photo exclusion');

for (const requiredSupportText of [
  'Can Your Pet Support',
  'Thanks for using Can Your Pet.',
  'Can Your Pet is a pet behavior discovery app that helps you explore the funny, unusual, sweet, and relatable things your dog or cat does.',
  'Need Help?',
  'your device model',
  'your iOS version',
  'the Can Your Pet app version',
  'a short description of what happened',
  'Do not include passwords or sensitive personal information.',
  'Common Questions',
  'Do I need an account?',
  'Why don’t I see a percentage for every challenge?',
  'Can Your Pet does not invent or display fake participation numbers.',
  'Is Can Your Pet giving veterinary or medical advice?',
  'No.',
  'If you have concerns about your pet’s health or wellbeing, contact a qualified veterinarian.',
  'Why is media sometimes unavailable?',
  'How can I request deletion of my data?',
  'Privacy',
  'https://fenghuashen.com/can-your-pet/privacy/',
  'Contact',
  'fenghua.shen@163.com',
  '© 2026 Can Your Pet'
]) {
  assert.match(supportHtml, new RegExp(escapeRegExp(requiredSupportText)), `missing required support page copy: ${requiredSupportText}`);
}

assert.match(supportHtml, /mailto:fenghua\.shen@163\.com/, 'support page must reuse the existing public email address');
for (const forbiddenAppPageText of [
  'Supabase',
  'milestone',
  'engineering architecture',
  'anonymous Auth UID',
  'Auth UID',
  'internal validation metrics',
  'GitHub',
  'Codex',
  'TestFlight blocker',
  'database'
]) {
  assert.equal(textExists(appPages, forbiddenAppPageText), false, `standalone app pages must not expose internal implementation details: ${forbiddenAppPageText}`);
}

console.log('International portfolio static checks passed.');
