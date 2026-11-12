import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse, render, apply, todayJst } from './update-now.mjs';

const note = `# ポートフォリオの「いま」
## 書き方
- 例：\`- 2026-11-12｜temoto-photo｜部分補正で…\`
## 一覧
- 2026-11-12｜health-management｜食事の記録アプリを、一般公開にする準備中です
- 2026-11-11｜shared-account-viewer｜非公開のアプリは出さない
- 2026-11-11｜temoto-photo｜管理画面は https://example.com から
- 2026-11-11｜go-out｜API キーを登録しました
- 2026-11-10｜school-festival｜学祭で使うレジの本番前です（11/13〜16）｜2026-11-16まで
- 2026-11-09｜happy_ideas｜三番目なので出ない
`;

test('上から 2 件、公開してよい作品だけ', () => {
  const items = parse(note, '2026-11-12');
  assert.deepEqual(items.map((i) => i.slug), ['health-management', 'school-festival']);
});

test('URL や鍵の話が入った行は出さない', () => {
  const texts = parse(note, '2026-11-12').map((i) => i.text).join('');
  assert.ok(!texts.includes('example.com'));
  assert.ok(!texts.includes('API キー'));
});

test('期限を過ぎた行は出ない', () => {
  const items = parse(note, '2026-11-17');
  assert.deepEqual(items.map((i) => i.slug), ['health-management', 'happy-ideas']);
});

test('未来の日付は出ない', () => {
  assert.equal(parse('- 2026-12-01｜timetable｜まだ先', '2026-11-12').length, 0);
});

test('HTML として危ない文字は変換する', () => {
  const html = render([{ date: '2026-11-12', slug: 'timetable', text: '<b>太字</b> & "引用"' }]);
  assert.ok(html.includes('&lt;b&gt;太字&lt;/b&gt; &amp; &quot;引用&quot;'));
  assert.ok(html.includes('href="/works/timetable/"'));
  assert.ok(html.includes('11/12'));
});

test('目印の間だけ書き換える', () => {
  const out = apply('a<!-- now:start -->\nold\n<!-- now:end -->b', [{ date: '2026-11-12', slug: 'go-out', text: 'x' }]);
  assert.ok(out.startsWith('a<!-- now:start -->\n<li'));
  assert.ok(out.endsWith('<!-- now:end -->b'));
  assert.ok(!out.includes('old'));
});

test('日本時間の日付', () => {
  assert.equal(todayJst(new Date('2026-11-12T15:30:00Z')), '2026-11-13');
});
