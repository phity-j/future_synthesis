# Future Synthesis

AI時代の未来思想メディアです。GitHub Pages、Pages CMS、Markdown、GitHub Actionsで運用できます。

## 完成ディレクトリ構成

```text
/
├─ .github/workflows/deploy.yml
├─ .nojekyll
├─ .pages.yml
├─ pagescms.config.json
├─ admin/
│  └─ index.html
├─ assets/
│  ├─ css/site.css
│  └─ js/site.js
├─ content/
│  ├─ posts/
│  └─ pages/
├─ public/
│  ├─ images/
│  └─ thumbnails/
├─ scripts/build.js
├─ site.config.json
├─ package.json
├─ index.html
├─ posts/
├─ categories/
├─ tags/
├─ rss.xml
├─ sitemap.xml
└─ robots.txt
```

## できること

- `/admin/` からPages CMSへ移動
- GitHub OAuthでログイン
- Markdown記事の追加、編集、下書き保存
- タグ、カテゴリー、シリーズ、マガジン管理
- サムネイル、OGP画像アップロード
- 固定ページ編集
- meta description、canonical、Twitter Card、Article schema生成
- RSS、sitemap、robots.txt生成
- 記事一覧、カテゴリー一覧、タグ一覧、関連記事、前後記事、検索UI
- 目次自動生成、読了時間表示、Newsletter UI、SNS共有導線

## GitHub Pages公開方法

1. この内容を `phity-j/future_synthesis` リポジトリへpushします。
2. GitHubのリポジトリ画面で `Settings` → `Pages` を開きます。
3. `Build and deployment` の `Source` を `GitHub Actions` にします。
4. `Actions` タブで `Deploy GitHub Pages` が成功するのを待ちます。
5. 公開URLは `https://phity-j.github.io/future_synthesis/` です。

## CMSログイン方法

1. 公開サイトの `/admin/` を開きます。
2. `Pages CMSを開く` を押します。
3. GitHubでログインします。
4. リポジトリ `phity-j/future_synthesis` を選びます。
5. `.pages.yml` が読み込まれると、記事・固定ページ・画像を編集できます。

Pages CMSの現行仕様では `.pages.yml` が正式な設定ファイルです。`pagescms.config.json` は要件確認とバックアップ用に置いています。

## GitHub OAuth / Pages CMS連携

オンライン版を使う場合は、Pages CMS側のGitHubログインを使います。自分専用にPages CMSをVercelなどへ設置する場合は、Pages CMS公式手順に従ってGitHub Appを作成します。

必要な権限は主に次の通りです。

- Repository contents: Read and write
- Pull requests: Read and write 任意
- Metadata: Read
- Callback URL: Pages CMSを設置したURLの `/api/auth/github`

## 記事投稿方法

1. Pages CMSで `記事` を開きます。
2. `New` を押します。
3. タイトル、説明、スラッグ、カテゴリー、タグ、サムネイルを入力します。
4. 本文をMarkdownで書きます。
5. `status` を `draft` にすると下書き、`published` にすると公開です。
6. 保存するとGitHubへ自動保存され、Actions成功後にPagesへ反映されます。

## Markdown frontmatter

```yaml
---
title: "記事タイトル"
description: "SEO用の説明文"
slug: "article-slug"
status: "published"
publishedAt: "2026-05-22T09:00:00+09:00"
updatedAt: "2026-05-22T09:00:00+09:00"
category: "AI文明論"
tags: ["AI文明論", "AGI", "未来予測"]
series: "AI文明論"
magazine: "未来思想"
thumbnail: "/public/thumbnails/ai-civilization.svg"
ogImage: "/public/images/og-future-synthesis.svg"
featured: true
popular: true
paid: false
canonical: ""
---
```

## Markdown記法

```md
# 大見出し
## 中見出し

本文を書きます。**強調** や `コード` が使えます。

- 箇条書き
- 箇条書き

[リンク](https://example.com)
```

## 画像アップロード方法

- 通常画像: `public/images/`
- 記事サムネイル: `public/thumbnails/`

Pages CMSのメディア画面からアップロードできます。記事の `thumbnail` や `ogImage` に選択した画像を指定します。

## カテゴリ追加方法

`.pages.yml` の `category` フィールドの `options` に追加します。現在のテーマは次の通りです。

AI文明論、AGI、AI国家、AI資本主義、建築AI、木造建築2.0、縮小社会、国家戦略、ネット空間、未来予測

## タグ追加方法

記事編集画面の `tags` に自由に追加できます。タグ一覧ページはビルド時に自動生成されます。

## SEO設定方法

- `description`: meta description、OGP description、Twitter Cardに使われます。
- `ogImage`: SNS共有画像に使われます。
- `canonical`: 必要に応じて正規URLを記録できます。
- `title`: titleタグ、OGP title、Article schemaに使われます。

## ローカル確認

```bash
npm run build
```

生成された `index.html` を開くと確認できます。GitHub Actions上でも同じビルドが実行されます。

## 将来拡張しやすい領域

- コメント
- 会員制
- 有料記事
- AI要約
- AIレコメンド
- ベクトル検索
- 日本語全文検索

`paid: true`、`series`、`magazine`、`search-index.json` をすでに用意しているため、後から機能を足しやすい構造です。
