import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import matter from 'gray-matter';
import { describe, it, expect } from 'vitest';

describe('docs frontmatter', () => {
  const files = globSync(path.join(process.cwd(), 'docs', '**/*.md'));
  it('every doc has id and title in frontmatter', () => {
    for (const f of files) {
      const raw = fs.readFileSync(f, 'utf8');
      const parsed = matter(raw);
      expect(parsed.data).toBeDefined();
      expect(parsed.data.id).toBeTruthy();
      expect(parsed.data.title).toBeTruthy();
    }
  });
});
