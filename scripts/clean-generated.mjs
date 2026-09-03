#!/usr/bin/env node
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');

const generatedPaths = [
  '.DS_Store',
  '.astro',
  '.site-content',
  'dist',
  'output',
  'tmp',
  'src/content/docs',
  'public/downloads/검색가능한-pnid.pdf',
  'scripts/__pycache__',
];

for (const relativePath of generatedPaths) {
  await rm(path.join(rootDir, relativePath), { recursive: true, force: true });
  console.log(`Removed ${relativePath}`);
}
