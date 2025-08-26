/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// import the module under test
import * as fetchModule from './fetchDoc';

describe('fetchAndCacheDoc', () => {
  const tmpDir = path.join(process.cwd(), 'tmp-test-docs');
  beforeEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
    fs.mkdirSync(tmpDir, { recursive: true });
  });
  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
    vi.restoreAllMocks();
  });

  it('saves content when API returns content', async () => {
    const owner = 'o';
    const repo = 'r';
    const branch = 'main';
    const candidate = ['foo.md'];
    const content = '# hello';
    const res = await fetchModule.fetchAndCacheDoc(owner, repo, branch, candidate, tmpDir, {
      fetchFromApi: async () => content,
      fetchRawUrl: async () => null,
    });
    expect(res).not.toBeNull();
    expect(res!.savedPath.endsWith('foo.md')).toBeTruthy();
    const saved = fs.readFileSync(res!.savedPath, 'utf8');
    expect(saved).toBe(content);
  });

  it('returns null when neither API nor raw provide content', async () => {
    const owner = 'o';
    const repo = 'r';
    const branch = 'main';
    const candidate = ['missing.md'];
    const res = await fetchModule.fetchAndCacheDoc(owner, repo, branch, candidate, tmpDir, {
      fetchFromApi: async () => null,
      fetchRawUrl: async () => null,
    });
    expect(res).toBeNull();
  });
});
