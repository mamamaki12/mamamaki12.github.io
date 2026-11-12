// 検索エンジン向けのファイルがそろっているかを確かめる
// - sitemap.xml にトップとすべての作品ページが入っている
// - robots.txt が sitemap.xml を指している
// - 各ページの構造化データ（JSON-LD）が読める
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://mamamaki12.github.io/';
const works = readdirSync(join(root, 'works'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

const jsonLd = (file) => {
  const html = readFileSync(join(root, file), 'utf8');
  const m = html.match(/<script type="application\/ld\+json">\n([\s\S]*?)\n<\/script>/);
  assert.ok(m, `${file} に構造化データがない`);
  return JSON.parse(m[1]);
};

test('sitemap.xml にトップとすべての作品ページがある', () => {
  const xml = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.deepEqual(new Set(locs), new Set([SITE, ...works.map((n) => `${SITE}works/${n}/`)]));
});

test('robots.txt が sitemap.xml を指している', () => {
  assert.match(readFileSync(join(root, 'robots.txt'), 'utf8'), /^Sitemap: https:\/\/mamamaki12\.github\.io\/sitemap\.xml$/m);
});

test('トップの構造化データにサイトと人がある', () => {
  const types = jsonLd('index.html')['@graph'].map((x) => x['@type']);
  assert.deepEqual(types.sort(), ['Person', 'WebSite']);
});

test('作品ページの構造化データが読め、作品ページを指している', () => {
  for (const name of works) {
    const app = jsonLd(`works/${name}/index.html`)['@graph'].find((x) => x['@type'] === 'WebApplication');
    assert.ok(app?.name, `${name}: 名前がない`);
    assert.equal(app.mainEntityOfPage, `${SITE}works/${name}/`);
  }
});
