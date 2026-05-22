const fs = require("fs");
const path = require("path");

const root = process.cwd();
const site = JSON.parse(fs.readFileSync(path.join(root, "site.config.json"), "utf8"));
const outDir = root;
const basePath = new URL(site.url).pathname.replace(/\/$/, "");

const categories = ["AI文明論", "AGI", "AI国家", "AI資本主義", "建築AI", "木造建築2.0", "縮小社会", "国家戦略", "ネット空間", "未来予測"];

function readMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".md")).map((file) => parseFile(path.join(dir, file)));
}

function parseFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const data = {};
  const body = match ? match[2] : raw;
  if (match) {
    match[1].split(/\r?\n/).forEach((line) => {
      const i = line.indexOf(":");
      if (i === -1) return;
      const key = line.slice(0, i).trim();
      let value = line.slice(i + 1).trim();
      value = value.replace(/^"|"$/g, "");
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value.slice(1, -1).split(",").map((item) => item.trim().replace(/^"|"$/g, "")).filter(Boolean);
      }
      if (value === "true") value = true;
      if (value === "false") value = false;
      data[key] = value;
    });
  }
  data.source = path.relative(root, filePath).replace(/\\/g, "/");
  data.body = body.trim();
  data.html = markdownToHtml(data.body);
  data.excerpt = stripMarkdown(data.body).slice(0, 140);
  data.readingTime = Math.max(1, Math.ceil(stripMarkdown(data.body).length / 500));
  data.url = data.slug ? `/posts/${data.slug}/` : "/";
  data.toc = extractToc(data.body);
  return data;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function stripMarkdown(markdown = "") {
  return markdown.replace(/```[\s\S]*?```/g, "").replace(/[#>*_`\-[\]()]/g, "").replace(/\n+/g, " ").trim();
}

function slugify(value = "") {
  return encodeURIComponent(value.toLowerCase().replace(/\s+/g, "-"));
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  let html = "";
  let inList = false;
  let inCode = false;
  let code = [];
  const closeList = () => {
    if (inList) html += "</ul>";
    inList = false;
  };
  lines.forEach((line) => {
    if (line.startsWith("```")) {
      if (inCode) {
        html += `<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`;
        code = [];
        inCode = false;
      } else {
        closeList();
        inCode = true;
      }
      return;
    }
    if (inCode) {
      code.push(line);
      return;
    }
    if (/^#{1,3}\s/.test(line)) {
      closeList();
      const level = line.match(/^#+/)[0].length;
      const text = line.replace(/^#{1,3}\s/, "");
      const id = slugify(text);
      html += `<h${level} id="${id}">${inlineMarkdown(text)}</h${level}>`;
      return;
    }
    if (/^-\s+/.test(line)) {
      if (!inList) html += "<ul>";
      inList = true;
      html += `<li>${inlineMarkdown(line.replace(/^-\s+/, ""))}</li>`;
      return;
    }
    if (/^>\s+/.test(line)) {
      closeList();
      html += `<blockquote>${inlineMarkdown(line.replace(/^>\s+/, ""))}</blockquote>`;
      return;
    }
    if (!line.trim()) {
      closeList();
      return;
    }
    closeList();
    html += `<p>${inlineMarkdown(line)}</p>`;
  });
  closeList();
  return html;
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function extractToc(markdown) {
  return markdown.split(/\r?\n/).filter((line) => /^##\s/.test(line)).map((line) => {
    const text = line.replace(/^##\s/, "");
    return { text, id: slugify(text) };
  });
}

function absoluteUrl(url = "") {
  if (!url) return site.url;
  if (/^https?:\/\//.test(url)) return url;
  return `${site.url}${url.startsWith("/") ? "" : "/"}${url}`;
}

function publicUrl(url = "") {
  if (!url || /^https?:\/\//.test(url) || url.startsWith("#")) return url;
  return `${basePath}${url.startsWith("/") ? "" : "/"}${url}`;
}

function head({ title, description, url, image, type = "website", article }) {
  const canonical = absoluteUrl(url);
  const ogImage = absoluteUrl(image || site.defaultOgImage);
  const schema = article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: ogImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: { "@type": "Organization", name: site.author },
    publisher: { "@type": "Organization", name: site.siteName },
    mainEntityOfPage: canonical
  } : {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.siteName,
    url: site.url,
    description: site.description,
    potentialAction: { "@type": "SearchAction", target: `${site.url}/?q={search_term_string}`, "query-input": "required name=search_term_string" }
  };
  return `<!doctype html>
<html lang="${site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} | ${escapeHtml(site.siteName)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:site_name" content="${escapeHtml(site.siteName)}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${ogImage}">
<meta name="theme-color" content="#050816">
<link rel="preload" href="${publicUrl("/assets/css/site.css")}" as="style">
<link rel="stylesheet" href="${publicUrl("/assets/css/site.css")}">
<link rel="alternate" type="application/rss+xml" title="${escapeHtml(site.siteName)} RSS" href="${publicUrl("/rss.xml")}">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>`;
}

function header() {
  return `<header class="site-header">
  <a class="brand" href="${publicUrl("/")}"><span class="brand-mark"></span><span>Future Synthesis</span></a>
  <nav class="nav">${site.navigation.map((item) => `<a href="${publicUrl(`/${item.href}`)}">${item.label}</a>`).join("")}<a href="${publicUrl("/admin/")}">Admin</a></nav>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div><strong>Future Synthesis</strong><p>AI・文明・建築・国家・資本の未来を考察する知的メディア。</p></div>
  <div class="footer-links"><a href="${publicUrl("/rss.xml")}">RSS</a><a href="${publicUrl("/sitemap.xml")}">Sitemap</a><a href="${publicUrl("/admin/")}">CMS</a></div>
</footer>
<script src="${publicUrl("/assets/js/site.js")}" defer></script>
</body></html>`;
}

function articleCard(post, className = "") {
  const tags = (post.tags || []).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  return `<article class="article-card ${className}" data-title="${escapeHtml(post.title)}" data-tags="${escapeHtml((post.tags || []).join(" "))}" data-category="${escapeHtml(post.category)}">
    <a href="${publicUrl(post.url)}" class="thumb"><img src="${publicUrl(post.thumbnail || site.defaultOgImage)}" alt="" loading="lazy" width="960" height="540"></a>
    <div class="card-body">
      <div class="meta"><span>${escapeHtml(post.category)}</span><span>${post.readingTime}分で読める</span></div>
      <h3><a href="${publicUrl(post.url)}">${escapeHtml(post.title)}</a></h3>
      <p>${escapeHtml(post.description || post.excerpt)}</p>
      <div class="tags">${tags}</div>
      <div class="card-actions"><button class="like-button" type="button" aria-label="スキ">♡</button><a href="${publicUrl(post.url)}">続きを読む</a></div>
    </div>
  </article>`;
}

function layout(content, meta) {
  return `${head(meta)}<body>${header()}${content}${footer()}`;
}

function renderHome(posts, pages) {
  const latest = posts.slice(0, 6);
  const ai = posts.filter((post) => ["AI文明論", "AGI", "AI国家", "AI資本主義"].includes(post.category));
  const wood = posts.filter((post) => ["木造建築2.0", "建築AI"].includes(post.category));
  const popular = posts.filter((post) => post.popular).slice(0, 4);
  const featured = posts.filter((post) => post.featured).slice(0, 3);
  const profile = pages.find((page) => page.slug === "about");
  return layout(`<main>
  <section class="hero">
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="hero-content">
      <p class="eyebrow">AI CIVILIZATION / FUTURE LAB</p>
      <h1>未来を設計する。</h1>
      <p>AI・文明・建築・国家・資本の未来を考察する知的メディア</p>
      <div class="hero-actions"><a class="button primary" href="#latest">読む</a><a class="button ghost" href="#newsletter">Newsletter</a></div>
    </div>
    <aside class="hero-panel">
      <span>Research Map</span>
      <strong>AI国家 / 木造建築2.0 / 縮小社会</strong>
      <p>思想、産業、制度、空間をつなぎ、次の文明モデルを編集する。</p>
    </aside>
  </section>

  <section class="section search-section">
    <div class="section-head"><p class="eyebrow">Search</p><h2>記事を探す</h2></div>
    <input id="site-search" class="search-input" type="search" placeholder="AI国家、木造建築2.0、縮小社会..." autocomplete="off">
  </section>

  ${renderSection("latest", "最新記事", latest)}
  ${renderSection("ai-civilization", "AI文明論", ai)}
  ${renderSection("wood-architecture", "木造建築2.0", wood)}
  ${renderSection("popular", "人気記事", popular)}
  ${renderFeatureSection(featured)}
  ${renderNewsletter()}
  ${renderProfile(profile)}
</main>`, { title: site.title, description: site.description, url: "/", image: site.defaultOgImage });
}

function renderSection(id, title, posts) {
  return `<section id="${id}" class="section">
    <div class="section-head"><p class="eyebrow">${id.replace("-", " ")}</p><h2>${title}</h2></div>
    <div class="grid">${posts.map((post) => articleCard(post)).join("")}</div>
  </section>`;
}

function renderFeatureSection(posts) {
  return `<section id="features" class="section feature-band">
    <div class="section-head"><p class="eyebrow">Feature</p><h2>特集</h2></div>
    <div class="feature-grid">${posts.map((post) => articleCard(post, "featured-card")).join("")}</div>
  </section>`;
}

function renderNewsletter() {
  return `<section id="newsletter" class="newsletter">
    <div>
      <p class="eyebrow">Newsletter</p>
      <h2>未来思想をメールで受け取る</h2>
      <p>新着記事、研究メモ、AI文明論の論点を週次で届けるためのUIです。実運用時はSubstack、Buttondown、ConvertKitなどへ接続できます。</p>
    </div>
    <form class="newsletter-form"><input type="email" placeholder="mail@example.com" aria-label="メールアドレス"><button type="submit">登録</button></form>
  </section>`;
}

function renderProfile(page) {
  return `<section id="profile" class="section profile">
    <div class="profile-orbit"></div>
    <div><p class="eyebrow">Profile</p><h2>${escapeHtml(page?.title || "プロフィール")}</h2><p>${escapeHtml(page?.description || site.description)}</p><a href="${publicUrl("/pages/about/")}">詳しく読む</a></div>
  </section>`;
}

function renderPost(post, posts) {
  const index = posts.findIndex((item) => item.slug === post.slug);
  const prev = posts[index + 1];
  const next = posts[index - 1];
  const related = posts.filter((item) => item.slug !== post.slug && (item.category === post.category || (item.tags || []).some((tag) => (post.tags || []).includes(tag)))).slice(0, 3);
  const toc = post.toc.length ? `<aside class="toc"><strong>目次</strong>${post.toc.map((item) => `<a href="#${item.id}">${escapeHtml(item.text)}</a>`).join("")}</aside>` : "";
  const paid = post.paid ? `<div class="paid-note"><strong>有料記事対応構造</strong><p>この記事は将来、会員限定・有料公開へ切り替えられるメタデータを持っています。</p></div>` : "";
  return layout(`<main class="article-layout">
    <article class="article">
      <div class="article-hero">
        <p class="eyebrow">${escapeHtml(post.category)}</p>
        <h1>${escapeHtml(post.title)}</h1>
        <p>${escapeHtml(post.description)}</p>
        <div class="article-meta"><span>${formatDate(post.publishedAt)}</span><span>${post.readingTime}分で読める</span><span>${escapeHtml(post.series || "")}</span></div>
      </div>
      <img class="article-image" src="${publicUrl(post.thumbnail || site.defaultOgImage)}" alt="" width="960" height="540" loading="eager">
      ${toc}
      <div class="prose">${post.html}</div>
      ${paid}
      ${renderArticleCta(post)}
      <nav class="post-nav">${prev ? `<a href="${publicUrl(prev.url)}">前の記事<br><strong>${escapeHtml(prev.title)}</strong></a>` : "<span></span>"}${next ? `<a href="${publicUrl(next.url)}">次の記事<br><strong>${escapeHtml(next.title)}</strong></a>` : "<span></span>"}</nav>
    </article>
    <section class="section related"><div class="section-head"><p class="eyebrow">Related</p><h2>関連記事</h2></div><div class="grid">${related.map((item) => articleCard(item)).join("")}</div></section>
  </main>`, { title: post.title, description: post.description, url: post.url, image: post.ogImage || post.thumbnail, type: "article", article: post });
}

function renderArticleCta(post) {
  const shareUrl = absoluteUrl(post.url);
  const text = encodeURIComponent(post.title);
  return `<section class="article-cta">
    <h2>この記事を共有する</h2>
    <p>Future Synthesisの議論を、X・Threads・note・Substackへ接続するための導線です。</p>
    <div class="share-row">
      <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${text}" rel="noopener">X共有</a>
      <a href="https://www.threads.net/intent/post?text=${text}%20${encodeURIComponent(shareUrl)}" rel="noopener">Threads共有</a>
      <a href="${site.social.note}" rel="noopener">note導線</a>
      <a href="${site.social.substack}" rel="noopener">Substack導線</a>
    </div>
    <form class="newsletter-form"><input type="email" placeholder="mail@example.com" aria-label="メールアドレス"><button type="submit">Newsletter登録</button></form>
  </section>`;
}

function renderPage(page) {
  return layout(`<main class="page-layout"><article class="article"><div class="article-hero"><p class="eyebrow">Page</p><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.description)}</p></div><div class="prose">${page.html}</div></article></main>`, { title: page.title, description: page.description, url: `/pages/${page.slug}/`, image: page.ogImage });
}

function renderListing(posts) {
  return layout(`<main class="page-layout"><section class="section"><div class="section-head"><p class="eyebrow">Archive</p><h1>記事一覧</h1></div><div class="grid">${posts.map((post) => articleCard(post)).join("")}</div></section></main>`, { title: "記事一覧", description: "Future Synthesisの記事一覧", url: "/posts/" });
}

function renderTaxonomy(posts, key, label) {
  const values = [...new Set(posts.flatMap((post) => key === "tags" ? (post.tags || []) : [post.category]).filter(Boolean))];
  return layout(`<main class="page-layout"><section class="section"><div class="section-head"><p class="eyebrow">${key}</p><h1>${label}</h1></div>${values.map((value) => `<section class="taxonomy-block"><h2>${escapeHtml(value)}</h2><div class="grid">${posts.filter((post) => key === "tags" ? (post.tags || []).includes(value) : post.category === value).map((post) => articleCard(post)).join("")}</div></section>`).join("")}</section></main>`, { title: label, description: `${site.siteName}の${label}`, url: `/${key}/` });
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

function writeFile(file, content) {
  const target = path.join(outDir, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function copyStatic() {
  writeFile("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
}

function renderFeeds(posts, pages) {
  const urls = ["/", "/posts/", "/categories/", "/tags/", ...posts.map((post) => post.url), ...pages.map((page) => `/pages/${page.slug}/`)];
  writeFile("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${absoluteUrl(url)}</loc></url>`).join("")}</urlset>`);
  writeFile("rss.xml", `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeHtml(site.siteName)}</title><link>${site.url}</link><description>${escapeHtml(site.description)}</description>${posts.slice(0, 20).map((post) => `<item><title>${escapeHtml(post.title)}</title><link>${absoluteUrl(post.url)}</link><guid>${absoluteUrl(post.url)}</guid><pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate><description>${escapeHtml(post.description)}</description></item>`).join("")}</channel></rss>`);
}

function build() {
  const posts = readMarkdownFiles(path.join(root, "content/posts")).filter((post) => post.status === "published" || post.status === "paid").sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const pages = readMarkdownFiles(path.join(root, "content/pages")).filter((page) => page.status !== "draft");
  writeFile("index.html", renderHome(posts, pages));
  writeFile("posts/index.html", renderListing(posts));
  writeFile("categories/index.html", renderTaxonomy(posts, "category", "カテゴリー一覧"));
  writeFile("tags/index.html", renderTaxonomy(posts, "tags", "タグ一覧"));
  posts.forEach((post) => writeFile(`posts/${post.slug}/index.html`, renderPost(post, posts)));
  pages.forEach((page) => writeFile(`pages/${page.slug}/index.html`, renderPage(page)));
  renderFeeds(posts, pages);
  copyStatic();
  writeFile("search-index.json", JSON.stringify(posts.map(({ title, description, category, tags, url }) => ({ title, description, category, tags, url })), null, 2));
}

build();
