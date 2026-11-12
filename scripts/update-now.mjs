// My海馬の「20_開発/ポートフォリオのいま.md」を読み、トップの「いま」を書き換える。
// 使い方：node scripts/update-now.mjs <ノートのパス> <index.html のパス>
// ノートが読めない・有効な行が無いときは何もしない（index.html の今の内容がそのまま公開される）。
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

// 公開してよい作品だけ（リポジトリ名 → 作品ページ）
const WORKS = {
  'open-world': 'open-world',
  'health-management': 'health-management',
  'temoto-photo': 'temoto-photo',
  timetable: 'timetable',
  'go-out': 'go-out',
  'tech-feed': 'tech-feed',
  'memory-map': 'memory-map',
  'school-festival': 'school-festival',
  'freedom-closet': 'freedom-closet',
  'pa-chinko': 'pa-chinko',
  happy_ideas: 'happy-ideas',
};
const MAX = 2;
const MAX_LEN = 60;
// 秘密の情報が混ざっていそうな行は出さない
const BLOCK = /https?:|www\.|\.(com|jp|io|dev|net|org)\b|@|`|#\d|token|secret|password|passwd|api[ _-]?key|sk-|ghp_|github_pat|パスワード|鍵|キー|トークン/i;

const START = '<!-- now:start -->';
const END = '<!-- now:end -->';

export function todayJst(now = new Date()) {
  return new Date(now.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

export function parse(md, today = todayJst()) {
  const items = [];
  for (const raw of md.split('\n')) {
    const m = raw.match(/^- (\d{4}-\d{2}-\d{2})｜([A-Za-z0-9_.-]+)｜(.+?)(?:｜(\d{4}-\d{2}-\d{2})まで)?\s*$/);
    if (!m) continue;
    const [, date, repo, text, until] = m;
    const slug = WORKS[repo];
    if (!slug) continue;
    if (date > today) continue;
    if (until && until < today) continue;
    const t = text.trim();
    if (!t || t.length > MAX_LEN || BLOCK.test(t)) continue;
    items.push({ date, slug, text: t });
  }
  items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return items.slice(0, MAX);
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function render(items) {
  return items
    .map((it, i) => {
      const md = `${Number(it.date.slice(5, 7))}/${Number(it.date.slice(8, 10))}`;
      const border = i === 0 ? '' : ' border-top: 1px solid #2A2926;';
      return `<li style="padding: 6px 0;${border}"><a href="/works/${it.slug}/" style="text-decoration: none"><span style="color: #9A968D">${md}</span>　${esc(it.text)} →</a></li>`;
    })
    .join('\n');
}

export function apply(html, items) {
  const a = html.indexOf(START);
  const b = html.indexOf(END);
  if (a < 0 || b < a) throw new Error('index.html に「いま」の目印がありません');
  return html.slice(0, a + START.length) + '\n' + render(items) + '\n' + html.slice(b);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [note, page] = process.argv.slice(2);
  if (!note || !existsSync(note)) {
    console.log('ノートが無いので「いま」はそのまま');
    process.exit(0);
  }
  const items = parse(readFileSync(note, 'utf8'));
  if (items.length === 0) {
    console.log('出せる行が無いので「いま」はそのまま');
    process.exit(0);
  }
  writeFileSync(page, apply(readFileSync(page, 'utf8'), items));
  console.log(`「いま」を ${items.length} 件に更新：` + items.map((i) => i.slug).join(', '));
}
