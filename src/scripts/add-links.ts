import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import matter from 'gray-matter';

const tooling: Record<string, string> = {
  nextjs: 'https://nextjs.org/',
  vite: 'https://vitejs.dev/',
  react: 'https://react.dev/',
  tailwind: 'https://tailwindcss.com/',
  prisma: 'https://www.prisma.io/',
  supabase: 'https://supabase.com/',
  playwright: 'https://playwright.dev/',
  storybook: 'https://storybook.js.org/',
  trpc: 'https://trpc.io/',
};

function addLinksToFile(file: string) {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);
  const front = parsed.data || {};
  front.toolingLinks = front.toolingLinks || {};
  const topics = (front.topics || []).map((t: string) => t.toLowerCase());
  for (const t of topics) {
    if (tooling[t]) front.toolingLinks[t] = tooling[t];
  }
  const out = matter.stringify(parsed.content, front);
  fs.writeFileSync(file, out, 'utf8');
}

const files = globSync(path.join(process.cwd(), 'docs', '**/*.md'));
for (const f of files) addLinksToFile(f);
console.log(`Updated ${files.length} docs with tooling links where applicable.`);
