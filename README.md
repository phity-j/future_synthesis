# FUTURE SYNTHESIS - 次世代AI思想メディア

JekyllとPages CMSを利用した、超軽量で管理が簡単な静的メディアサイトです。

## 🚀 GitHub Pages への公開方法

このリポジトリは、特別なビルド設定（GitHub Actions等）を必要としません。GitHub Pagesが標準で対応している「Jekyll」を使用しているため、エラーで止まる確率が非常に低くなっています。

1. GitHubの `Settings` > `Pages` に移動します。
2. `Build and deployment` の `Source` を **Deploy from a branch** に設定します。
3. ブランチとして **main** を選択し、`/ (root)` で `Save` を押します。
4. これで数分待つだけでサイトが公開されます。

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
- 保存すると自動的にGitHubへコミットされ、自動的にサイトに反映されます。

### サムネイル画像のアップロード
- Pages CMSのエディタ上で画像フィールドのファイル選択ボタンを押すか、左メニューの **Media** からアップロードできます。（画像は `images` フォルダに保存されます）
