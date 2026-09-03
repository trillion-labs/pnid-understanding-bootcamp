#!/usr/bin/env node
import { execFile as execFileCallback } from 'node:child_process';
import { mkdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const execFile = promisify(execFileCallback);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const sourcePdf = path.join(rootDir, 'source', 'sample-pid.pdf');
const tempDir = path.join(rootDir, 'tmp', 'redaction-build');
const renderedBase = path.join(tempDir, 'source-page');
const renderedPage = `${renderedBase}.png`;
const manifest = JSON.parse(
  await readFile(path.join(rootDir, 'data', 'redaction.json'), 'utf8'),
);
const [sourceWidth, sourceHeight] = manifest.source_image_size;

await mkdir(tempDir, { recursive: true });
await execFile('pdftoppm', [
  '-png',
  '-r',
  '300',
  '-f',
  '1',
  '-singlefile',
  sourcePdf,
  renderedBase,
]);

const metadata = await sharp(renderedPage).metadata();
if (metadata.width !== sourceWidth || metadata.height !== sourceHeight) {
  throw new Error(
    `Unexpected source render size: ${metadata.width}x${metadata.height}; expected ${sourceWidth}x${sourceHeight}`,
  );
}

const redactionSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${sourceWidth}" height="${sourceHeight}">${manifest.redactions
    .map(({ bbox }) => {
      const [x1, y1, x2, y2] = bbox;
      return `<rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" fill="white" stroke="black" stroke-width="12"/>`;
    })
    .join('')}</svg>`,
);

const fullPath = path.join(rootDir, '실습자료', '이미지', '원본-고해상도-도면.png');
await sharp(renderedPage).composite([{ input: redactionSvg }]).png().toFile(fullPath);

await sharp(fullPath)
  .resize({ width: 1600 })
  .png()
  .toFile(path.join(rootDir, '실습자료', '이미지', '전체-도면.png'));

await sharp(fullPath)
  .extract({ left: 3920, top: 1450, width: 890, height: 1920 })
  .png()
  .toFile(path.join(rootDir, '실습자료', '이미지', '제목란.png'));

await sharp(path.join(rootDir, '실습자료', '이미지', 'feeder-c-원본-확대.png'))
  .resize({ height: 1600, withoutEnlargement: true })
  .png()
  .toFile(path.join(rootDir, '실습자료', '이미지', 'feeder-c-확대.png'));

await rm(tempDir, { recursive: true, force: true });
console.log(`Rendered the private source and applied ${manifest.redactions.length} public redactions.`);
