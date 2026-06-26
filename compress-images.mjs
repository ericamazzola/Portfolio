/**
 * compress-images.mjs
 * Comprime tutte le immagini in public/images in-place.
 * Esegui con: node compress-images.mjs
 *
 * Prima installazione (solo la prima volta):
 *   npm install sharp --save-dev
 */

import sharp from 'sharp';
import { readdir, stat, writeFile } from 'fs/promises';
import { join, extname, basename } from 'path';

const IMAGE_DIR = './public/images';

// Impostazioni qualità
const JPG_QUALITY = 80;   // 1-100
const WEBP_QUALITY = 78;  // 1-100
const PNG_QUALITY = 80;   // compressione PNG (1-100)

let totalBefore = 0;
let totalAfter = 0;
let skipped = 0;
let processed = 0;

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function compress(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

  const statBefore = await stat(filePath);
  const sizeBefore = statBefore.size;

  let outputBuffer;

  try {
    const img = sharp(filePath);
    const meta = await img.metadata();

    if (ext === '.jpg' || ext === '.jpeg') {
      outputBuffer = await img
        .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
        .toBuffer();
    } else if (ext === '.webp') {
      outputBuffer = await img
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
    } else if (ext === '.png') {
      outputBuffer = await img
        .png({ quality: PNG_QUALITY, compressionLevel: 9 })
        .toBuffer();
    }

    // Scrivi solo se otteniamo un risparmio effettivo
    if (outputBuffer.length < sizeBefore) {
      await writeFile(filePath, outputBuffer);
      totalBefore += sizeBefore;
      totalAfter += outputBuffer.length;
      processed++;
      const saved = ((sizeBefore - outputBuffer.length) / sizeBefore * 100).toFixed(1);
      const name = filePath.replace('./public/images/', '');
      console.log(`✓ ${name}  ${(sizeBefore/1024).toFixed(0)}KB → ${(outputBuffer.length/1024).toFixed(0)}KB  (-${saved}%)`);
    } else {
      skipped++;
      console.log(`– ${filePath.replace('./public/images/', '')}  già ottimizzata`);
    }
  } catch (err) {
    console.error(`✗ Errore su ${filePath}: ${err.message}`);
  }
}

async function main() {
  console.log('🗜  Compressione immagini in corso...\n');
  const files = await getFiles(IMAGE_DIR);
  for (const file of files) {
    await compress(file);
  }

  const savedMB = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1);
  const savedPct = totalBefore > 0
    ? ((totalBefore - totalAfter) / totalBefore * 100).toFixed(1)
    : 0;

  console.log(`\n✅ Fatto!`);
  console.log(`   Immagini compresse: ${processed}`);
  console.log(`   Già ottimizzate:    ${skipped}`);
  console.log(`   Risparmio totale:   ${savedMB} MB  (-${savedPct}%)`);
}

main();
