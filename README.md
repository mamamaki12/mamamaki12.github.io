# mamamaki12.github.io

しんごのポートフォリオサイト。https://mamamaki12.github.io/

- ビルドなしの HTML だけのサイト。`index.html` がトップ、`works/<作品名>/index.html` が作品の詳細、`images/` が画面写真
- `main` に入ると GitHub Actions（`.github/workflows/pages.yml`）が GitHub Pages に公開する
- 手元で見る：`python3 -m http.server 4173` を実行して http://localhost:4173 を開く
- 差し色は各ページの `<style>` の `--accent`
- 検索エンジン向け：`sitemap.xml`（トップとすべての作品ページ）・`robots.txt`、各ページの `<head>` の構造化データ（JSON-LD。トップはサイトと人、作品ページは Web アプリ）。作品を足したら sitemap.xml にも足し、構造化データも同じ形で入れる（`scripts/seo.test.mjs` が確かめる）
- `googledacb7bfdaa89fa1d.html` は Google Search Console の所有者の確認用。消さない

## トップの「いま」（自動更新）

- 元は My海馬（非公開の `mamamaki12/my-kaiba-ai`）の `20_開発/ポートフォリオのいま.md`。書き方はそのノートにある
- 公開のたびと毎朝 6:07（日本時間）に、`scripts/update-now.mjs` がそのノートの上から 2 件で `index.html` の `<!-- now:start -->` 〜 `<!-- now:end -->` を書き換えてから公開する。リポジトリの `index.html` は書き換えない
- 出すのはポートフォリオに載っている作品の行だけ。URL・メールアドレス・鍵らしい言葉を含む行、60 字を超える行、期限（`｜YYYY-MM-DDまで`）を過ぎた行は出さない
- My海馬を読むには、このリポジトリの Secrets に `KAIBA_TOKEN`（`my-kaiba-ai` の Contents を読むだけの fine-grained token）が要る。無いとき・読めないときは `index.html` に書いてある内容がそのまま出る
- テスト：`node --test scripts/*.test.mjs`
