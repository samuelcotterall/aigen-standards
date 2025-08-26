export type ToolInfo = {
  key: string;
  name: string;
  url: string;
  docsUrl?: string;
  synonyms?: string[];
};

const TOOLS: Record<string, ToolInfo> = {
  next: {
    key: 'next',
    name: 'Next.js',
    url: 'https://nextjs.org/',
    docsUrl: 'https://nextjs.org/docs',
    synonyms: ['nextjs'],
  },
  react: { key: 'react', name: 'React', url: 'https://react.dev/', docsUrl: 'https://react.dev' },
  vite: { key: 'vite', name: 'Vite', url: 'https://vitejs.dev/', docsUrl: 'https://vitejs.dev/guide/' },
  tailwind: { key: 'tailwind', name: 'Tailwind CSS', url: 'https://tailwindcss.com/', docsUrl: 'https://tailwindcss.com/docs' },
  prisma: { key: 'prisma', name: 'Prisma', url: 'https://www.prisma.io/', docsUrl: 'https://www.prisma.io/docs' },
  supabase: { key: 'supabase', name: 'Supabase', url: 'https://supabase.com/', docsUrl: 'https://supabase.com/docs' },
  playwright: { key: 'playwright', name: 'Playwright', url: 'https://playwright.dev/', docsUrl: 'https://playwright.dev/docs/intro' },
  storybook: { key: 'storybook', name: 'Storybook', url: 'https://storybook.js.org/', docsUrl: 'https://storybook.js.org/docs' },
  trpc: { key: 'trpc', name: 'tRPC', url: 'https://trpc.io/', docsUrl: 'https://trpc.io/' },
  'react-router': { key: 'react-router', name: 'React Router', url: 'https://reactrouter.com', docsUrl: 'https://reactrouter.com' },
};

// Build a synonyms map for quick canonicalization
const SYNONYMS: Record<string, string> = {};
for (const k of Object.keys(TOOLS)) {
  const info = TOOLS[k];
  if (info.synonyms) for (const s of info.synonyms) SYNONYMS[s.toLowerCase()] = k;
}

export function canonicalize(topic: string | undefined): string | undefined {
  if (!topic) return undefined;
  const t = String(topic).toLowerCase().trim();
  if (TOOLS[t]) return t;
  if (SYNONYMS[t]) return SYNONYMS[t];
  // try simple normalizations
  if (t === 'nextjs') return 'next';
  if (t === 'tailwindcss' || t === 'tailwindcss3' || t === 'tailwindcss4') return 'tailwind';
  return t;
}

export function findTool(keyOrTopic: string | undefined): ToolInfo | undefined {
  const k = canonicalize(keyOrTopic);
  if (!k) return undefined;
  return TOOLS[k];
}

export function getToolUrl(keyOrTopic: string | undefined): string | undefined {
  const t = findTool(keyOrTopic);
  return t ? t.docsUrl || t.url : undefined;
}

export function getToolRef(keyOrTopic: string | undefined): { name: string; url: string } | undefined {
  const t = findTool(keyOrTopic);
  if (!t) return undefined;
  return { name: t.name + ' docs', url: t.docsUrl || t.url };
}

export const ALL_TOOLS = TOOLS;
