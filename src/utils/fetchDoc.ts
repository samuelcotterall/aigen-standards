import https from 'https';
import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';
import { Octokit } from '@octokit/rest';
import crypto from 'crypto';

type FetchResult = { savedPath: string } | null;

function logDebug(...args: unknown[]) {
  if (process.env.EXTRACT_DEBUG === '1') console.error('[fetchDoc]', ...args);
}

export async function fetchFromApi(owner: string, repo: string, branch: string, rel: string, token?: string): Promise<string | null> {
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/contents/${encodeURIComponent(rel)}?ref=${encodeURIComponent(branch)}`,
    headers: {
      'User-Agent': 'aigen-standards-fetcher',
      Accept: 'application/vnd.github.v3.raw'
    }
  } as any;
  if (token) options.headers.Authorization = `token ${token}`;

  return new Promise((resolve, reject) => {
    https
      .get(options, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(Buffer.from(c)));
        res.on('end', () => {
          if (!res.statusCode) return resolve(null);
          if (res.statusCode === 200) {
            const body = Buffer.concat(chunks).toString('utf8');
            // If API returned JSON with base64 content, try to parse
            try {
              const maybe = JSON.parse(body);
              if (maybe && maybe.content && maybe.encoding === 'base64') {
                const decoded = Buffer.from(maybe.content, 'base64').toString('utf8');
                return resolve(decoded);
              }
            } catch (e) {
              // not JSON, assume raw body
            }
            return resolve(body);
          }
          resolve(null);
        });
      })
      .on('error', (err) => reject(err));
  });
}

export function fetchRawUrl(url: string): Promise<string | null> {
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

export async function fetchAndCacheDoc(
  owner: string,
  repo: string,
  branch: string,
  candidatePaths: string[],
  destDir: string,
  opts?: {
    fetchFromApi?: (owner: string, repo: string, branch: string, rel: string, token?: string) => Promise<string | null>;
    fetchRawUrl?: (url: string) => Promise<string | null>;
  }
): Promise<FetchResult> {
  const token = process.env.GITHUB_TOKEN;
  for (const rel of candidatePaths) {
    try {
      logDebug('trying API for', rel);
      const apiRes = await (opts && opts.fetchFromApi ? opts.fetchFromApi(owner, repo, branch, rel, token) : fetchFromApi(owner, repo, branch, rel, token));
      let content: string | null = apiRes;
      if (!content) {
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${rel}`;
        logDebug('falling back to raw url', rawUrl);
        content = await (opts && opts.fetchRawUrl ? opts.fetchRawUrl(rawUrl) : fetchRawUrl(rawUrl));
      }
      if (!content) {
        logDebug('no content for', rel);
        continue;
      }
      const outPath = path.join(destDir, rel);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, content, 'utf8');
      logDebug('saved', outPath);

      // optional: auto-commit the cached doc back to the repo and open a PR when requested
      try {
        if (process.env.EXTRACT_AUTO_COMMIT === '1' && token) {
          // deterministic branch name per path: short sha1 of rel
          const hash = crypto.createHash('sha1').update(rel).digest('hex').slice(0, 8);
          const branchName = `docs-cache/${hash}`;
          logDebug('auto-commit enabled, branch', branchName);
          const octokit = new Octokit({ auth: token });
          // get base branch sha
          const baseRef = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
          const baseSha = baseRef.data.object.sha;
          // ensure branch exists (create if missing)
          try {
            await octokit.rest.git.getRef({ owner, repo, ref: `heads/${branchName}` });
            logDebug('branch exists; reusing', branchName);
          } catch (err: any) {
            if (err && err.status === 404) {
              await octokit.rest.git.createRef({ owner, repo, ref: `refs/heads/${branchName}`, sha: baseSha });
              logDebug('created branch', branchName);
            } else {
              throw err;
            }
          }
          // create or update file on branch
          const contentB64 = Buffer.from(content, 'utf8').toString('base64');
          await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: rel,
            message: `chore(docs): cache fetched doc ${rel}`,
            content: contentB64,
            branch: branchName
          });
          // try to find existing open PR for this branch
          const prs = await octokit.rest.pulls.list({ owner, repo, head: `${owner}:${branchName}`, base: branch, state: 'open' });
          let prNumber: number | null = null;
          if (prs.data && prs.data.length) {
            prNumber = prs.data[0].number;
            logDebug('found existing PR', prNumber);
          } else {
            const pr = await octokit.rest.pulls.create({ owner, repo, title: `chore(docs): cache ${rel}`, head: branchName, base: branch, body: `Automated caching of ${rel}` });
            prNumber = pr.data.number;
            logDebug('created PR', pr.data.html_url);
          }
          // optional reviewers and labels via event/env
          const reviewers = (process.env.EXTRACT_PR_REVIEWERS || '').split(',').map((s) => s.trim()).filter(Boolean);
          if (reviewers.length && prNumber) {
            await octokit.rest.pulls.requestReviewers({ owner, repo, pull_number: prNumber, reviewers });
          }
          const labels = (process.env.EXTRACT_PR_LABELS || '').split(',').map((s) => s.trim()).filter(Boolean);
          if (labels.length && prNumber) {
            await octokit.rest.issues.addLabels({ owner, repo, issue_number: prNumber, labels });
          }
        }
      } catch (e: any) {
        logDebug('auto-commit failed', e && e.message);
      }

      return { savedPath: outPath };
    } catch (e: any) {
      logDebug('fetch error for', rel, e && e.message);
      continue;
    }
  }
  return null;
}
