import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import matter from 'gray-matter';

function removeToolingLinksFromFile(file: string) {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);
  const front = parsed.data || {};
  if (!Object.prototype.hasOwnProperty.call(front, 'toolingLinks')) return false;
  // backup original
  fs.copyFileSync(file, file + '.bak');
  delete front.toolingLinks;
  const out = matter.stringify(parsed.content, front);
  fs.writeFileSync(file, out, 'utf8');
  return true;
}

const docsGlob = path.join(process.cwd(), 'docs', '**', '*.md');
const files = globSync(docsGlob, { nodir: true });
let changed = 0;
for (const file of files) {
  try {
    if (removeToolingLinksFromFile(file)) changed++;
  } catch (err) {
    console.error('failed to process', file, err);
  }
}

console.log(`Removed toolingLinks from ${changed} files (backups *.bak created).`);
