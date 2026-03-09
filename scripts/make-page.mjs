import fs from 'fs';
import path from 'path';

const [, , ...args] = process.argv;

function printUsage() {
  console.log('Usage: npm run make:page -- <slug> "<Title>"');
  console.log('Example: npm run make:page -- about "A propos"');
}

function getArgValue(flag) {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  return args[index + 1] ?? null;
}

const slug = getArgValue('--slug') ?? args[0];
const title = getArgValue('--title') ?? args[1];

if (!slug || !title) {
  printUsage();
  process.exit(1);
}

const projectRoot = process.cwd();
const pageDir = path.join(projectRoot, 'app', slug);
const pageFile = path.join(pageDir, 'page.tsx');

if (!fs.existsSync(pageDir)) {
  fs.mkdirSync(pageDir, { recursive: true });
}

if (!fs.existsSync(pageFile)) {
  const pageContents = `import React from 'react';
import { notFound } from 'next/navigation';
import PageShell from '../../components/PageShell';
import { getPage } from '../../content/pages';

export default function ${slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}Page() {
  const page = getPage('${slug}');
  if (!page) {
    return notFound();
  }

  return <PageShell title={page.title} intro={page.intro} sections={page.sections} />;
}
`;
  fs.writeFileSync(pageFile, pageContents, 'utf8');
  console.log(`Created ${pageFile}`);
} else {
  console.log(`Page already exists: ${pageFile}`);
}

const contentDir = path.join(projectRoot, 'content');
const contentFile = path.join(contentDir, 'pages.ts');

if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

const baseContent = `export type PageSection = {
  title?: string;
  body: string;
};

export type PageData = {
  title: string;
  intro?: string;
  sections?: PageSection[];
};

export const pages: Record<string, PageData> = {
  // PAGES:START
  // PAGES:END
};

export function getPage(slug: string): PageData | undefined {
  return pages[slug];
}
`;

if (!fs.existsSync(contentFile)) {
  fs.writeFileSync(contentFile, baseContent, 'utf8');
  console.log(`Created ${contentFile}`);
}

const contentText = fs.readFileSync(contentFile, 'utf8');
const hasEntry = new RegExp(`['"]${slug}['"]\\s*:`).test(contentText);

if (hasEntry) {
  console.log(`Content entry already exists for "${slug}".`);
  process.exit(0);
}

const startMarker = '// PAGES:START';
const endMarker = '// PAGES:END';

if (!contentText.includes(startMarker) || !contentText.includes(endMarker)) {
  console.log('Missing PAGES markers in content/pages.ts. Please add entry manually.');
  process.exit(0);
}

const escapeForSingleQuotes = (value) => value.replace(/'/g, "\\'");
const titleSafe = escapeForSingleQuotes(title);
const entry = `  '${slug}': {
    title: '${titleSafe}',
    intro: 'Intro a remplir.',
    sections: [
      { title: 'Section 1', body: 'Contenu a remplir.' },
    ],
  },
`;

const updated = contentText.replace(
  endMarker,
  `${entry}  ${endMarker}`
);

fs.writeFileSync(contentFile, updated, 'utf8');
console.log(`Added content entry for "${slug}".`);
