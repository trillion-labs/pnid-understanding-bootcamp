import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inputPath = path.join(rootDir, '실습자료/이미지/feeder-c-원본-확대.png');
const outputPath = path.join(rootDir, '실습자료/근거-이미지/feeder-c-근거.png');

const evidenceBox = [220, 700, 750, 1550];
const [x1, y1, x2, y2] = evidenceBox;

const overlay = `
  <svg width="1330" height="1710" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="${x1}"
      y="${y1}"
      width="${x2 - x1}"
      height="${y2 - y1}"
      fill="none"
      stroke="#1d4ed8"
      stroke-width="8"
    />
  </svg>
`;

await sharp(inputPath)
  .composite([{ input: Buffer.from(overlay) }])
  .png()
  .toFile(outputPath);

console.log(`Wrote ${path.relative(rootDir, outputPath)} with bbox [${evidenceBox.join(', ')}]`);
