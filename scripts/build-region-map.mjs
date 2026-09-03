import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const sourcePath = path.join(rootDir, 'assets/full/J-11520-ZM-105-005_page-001.png');
const regionsPath = path.join(rootDir, 'data/regions.jsonl');
const outputPath = path.join(rootDir, 'assets/bbox/pid-major-regions.png');

const colors = ['#006DFF', '#E5484D', '#7C3AED', '#00875A', '#D97706', '#C026D3'];
const regionLines = (await readFile(regionsPath, 'utf8')).trim().split('\n');
const regions = regionLines.map((line) => JSON.parse(line));
const metadata = await sharp(sourcePath).metadata();

const boxes = regions.map((region, index) => {
  const [x1, y1, x2, y2] = region.bbox;
  const width = x2 - x1;
  const height = y2 - y1;
  const color = colors[index % colors.length];
  const labelWidth = 190;
  const labelHeight = 76;

  return `
    <rect x="${x1}" y="${y1}" width="${width}" height="${height}"
      fill="${color}" fill-opacity="0.08" stroke="${color}" stroke-width="16"/>
    <rect x="${x1}" y="${y1}" width="${labelWidth}" height="${labelHeight}"
      rx="10" fill="${color}"/>
    <text x="${x1 + 20}" y="${y1 + 54}" fill="white"
      font-family="Arial, sans-serif" font-size="48" font-weight="700">${region.region_id}</text>`;
}).join('');

const overlay = Buffer.from(`
  <svg width="${metadata.width}" height="${metadata.height}" xmlns="http://www.w3.org/2000/svg">
    ${boxes}
  </svg>
`);

await mkdir(path.dirname(outputPath), { recursive: true });
await sharp(sourcePath)
  .composite([{ input: overlay, top: 0, left: 0 }])
  .png()
  .toFile(outputPath);

console.log(`Wrote ${path.relative(rootDir, outputPath)}`);
