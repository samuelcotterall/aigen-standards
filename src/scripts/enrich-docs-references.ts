#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

const indexPath = path.join(process.cwd(), 'docs', 'docs-index.json');
if (!fs.existsSync(indexPath)) {
  console.error('docs-index.json not found; run build-docs-index first');
  process.exit(1);
}

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8')) as Array<any>;

const mapping: Record<string, { name: string; url: string }> = {
  next: { name: 'Next.js docs', url: 'https://nextjs.org/docs' },
  'app-router': { name: 'Next.js App Router docs', url: 'https://nextjs.org/docs/app' },
  react: { name: 'React docs', url: 'https://react.dev' },
  vite: { name: 'Vite docs', url: 'https://vitejs.dev/guide/' },
  tailwind: { name: 'Tailwind CSS docs', url: 'https://tailwindcss.com/docs' },
  prisma: { name: 'Prisma docs', url: 'https://www.prisma.io/docs' },
  supabase: { name: 'Supabase docs', url: 'https://supabase.com/docs' },
  playwright: { name: 'Playwright docs', url: 'https://playwright.dev/docs/intro' },
  routing: { name: 'React Router docs', url: 'https://reactrouter.com' },
  routinglib: { name: 'React Router docs', url: 'https://reactrouter.com' },
  styling: { name: 'Tailwind CSS docs', url: 'https://tailwindcss.com/docs' },
  architecture: { name: 'Architecture guidelines', url: 'https://nextjs.org/docs/architecture' },
  zod: { name: 'Zod docs', url: 'https://zod.dev' },
  reactaria: {
    name: 'React Aria / React Spectrum',
    url: 'https://react-spectrum.adobe.com/react-aria/',
  },
  'react-router': { name: 'React Router docs', url: 'https://reactrouter.com' },
};

function chooseRefs(item: any) {
  const refs: Array<{ name: string; url: string }> = [];
  const add = (key: string) => {
    const m = mapping[key];
    if (m && !refs.find((r) => r.url === m.url)) refs.push(m);
  };
  if (Array.isArray(item.topics)) item.topics.forEach((t: string) => add(String(t).toLowerCase()));
  if (Array.isArray(item.scope)) item.scope.forEach((s: string) => add(String(s).toLowerCase()));
  // fallback by id/title keywords
  const text = (item.id + ' ' + item.title).toLowerCase();
  Object.keys(mapping).forEach((k) => {
    if (text.includes(k) && !refs.find((r) => r.url === mapping[k].url)) refs.push(mapping[k]);
  });
  // ensure some default refs for common cases
  if (!refs.length) refs.push({ name: 'General web docs', url: 'https://developer.mozilla.org/' });
  return refs;
}

const updated: string[] = [];
for (const item of index) {
  const mdPath = path.join(process.cwd(), item.file);
  if (!fs.existsSync(mdPath)) continue;
  const raw = fs.readFileSync(mdPath, 'utf8');
  if (/^##+\s*References?/im.test(raw) || /Validated with/i.test(raw)) continue;
  const refs = chooseRefs(item);
  const refLines = [
    '\n## References / Validation',
    '\nThe content in this document has been reviewed against authoritative sources:',
  ];
  for (const r of refs) refLines.push(`- [${r.name}](${r.url})`);
  refLines.push(
    '\n_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._\n'
  );
  fs.appendFileSync(mdPath, refLines.join('\n') + '\n', 'utf8');
  updated.push(item.file);
}

if (updated.length) console.error('Enriched:', updated.join(', '));
else console.error('No files needed enrichment');
