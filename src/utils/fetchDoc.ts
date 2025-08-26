import https from 'https';
import fs from 'fs';
import path from 'path';

type FetchResult = { savedPath: string } | null;

export async function fetchAndCacheDoc(owner: string, repo: string, branch: string, candidatePaths: string[], destDir: string): Promise<FetchResult> {
  for (const rel of candidatePaths) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${rel}`;
    try {
      const content = await fetchText(url);
      if (!content) continue;
      const outPath = path.join(destDir, rel);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, content, 'utf8');
      return { savedPath: outPath };
    } catch (e) {
      // ignore and try next
    }
  }
  return null;
}

function fetchText(url: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
          res.resume();
          return resolve(null);
        }
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(Buffer.from(c)));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      })
      .on('error', (err) => reject(err));
  });
}
