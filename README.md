# FUTURE SYNTHESIS - 次世代AI思想メディ　ア　

AstroとPages CMSを利用した、静的サイトジェネレーター（SSG）ベースのメディアサイトです。

## 🚀 GitHub Pages への公開方法

このリポジトリをGitHubにプッシュするだけで、GitHub Actionsが自動的にAstroをビルドし、GitHub Pagesにデプロイします。

1. このリポジトリをGitHubにPushします。
2. GitHubの `Settings` > `Pages` に移動します。
3. `Source` を **GitHub Actions** に変更します。
4. 以降はコードや記事がPushされるたびに自動でサイトが更新されます。

## 📝 CMS (Pages CMS) でのログイン・編集方法

HTMLやMarkdownを直接いじることなく、ブラウザ上で記事の投稿・編集が可能です。

1. [Pages CMS](https://pagescms.org) にアクセスします。
2. **Login with GitHub** をクリックし、GitHubアカウントで認証します。
3. リポジトリ一覧から `phity-j/future_synthesis` を選択します。
4. 設定ファイル (`.pages.yml`) が自動的に読み込まれ、ダッシュボードが表示されます。

### 記事の投稿方法
- 左メニューの **「記事 (Posts)」** をクリックします。
- 右上の **「New 記事 (Posts)」** をクリックします。
- タイトル、日付、カテゴリ、サムネイル画像（`/images/xxx.png`を選択）を入力し、本文を記述します。
- 保存すると自動的にGitHubへコミットされ、数分後にサイトに反映されます。

### サムネイル画像のアップロード
- Pages CMSのエディタ上で画像フィールドのファイル選択ボタンを押すか、左メニューの **Media** からアップロードできます。（画像は `public/images` フォルダに保存されます）

### カテゴリ・タグの追加
- 記事作成画面の「カテゴリー」や「タグ」フィールドに新しい文字を入力して保存するだけで、自動的に反映されます。

### SEO設定
- 記事の「概要 (Description)」フィールドが、そのままGoogle検索結果やSNSシェア時（OGP）のテキストとして使用されます。
- サムネイル画像も自動的にTwitter Card等に最適化して出力されます。

## 💻 ローカル開発環境の立ち上げ

ご自身のPCでデザインの変更や開発を行う場合の手順です（※Node.js v18以上が必要です）。

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで `http://localhost:4321/future_synthesis` にアクセスして確認できます。
