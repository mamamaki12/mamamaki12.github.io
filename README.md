# mamamaki12.github.io

しんごのポートフォリオサイト。https://mamamaki12.github.io/

- ビルドなしの HTML だけのサイト。`index.html` がトップ、`works/<作品名>/index.html` が作品の詳細、`images/` が画面写真
- `main` に入ると GitHub Actions（`.github/workflows/pages.yml`）が GitHub Pages に公開する
- 手元で見る：`python3 -m http.server 4173` を実行して http://localhost:4173 を開く
- 差し色は各ページの `<style>` の `--accent`
