/**
 * FreshMart Image Optimization Script
 * Converts all product images to WebP format at 400px width, ~80% quality
 * Run: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../client/public/assets/products');
const OUTPUT_DIR = path.join(__dirname, '../client/public/assets/products');

const TARGET_WIDTH = 400;
const TARGET_QUALITY = 82;

async function optimizeImages() {
  const files = fs.readdirSync(INPUT_DIR);
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

  console.log(`\n🔍 Found ${imageFiles.length} images to process...\n`);

  const results = [];
  let totalOriginalSize = 0;
  let totalNewSize = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(INPUT_DIR, file);
    const baseName = path.parse(file).name;
    // Skip if already a hero banner (keep as-is for large display)
    if (baseName === 'hero-banner-chatgpt') {
      console.log(`⏭️  Skipping hero banner: ${file}`);
      continue;
    }

    const outputFile = `${baseName}.webp`;
    const outputPath = path.join(OUTPUT_DIR, outputFile);

    const originalStat = fs.statSync(inputPath);
    const originalKB = (originalStat.size / 1024).toFixed(1);

    try {
      await sharp(inputPath)
        .resize(TARGET_WIDTH, TARGET_WIDTH, {
          fit: 'inside',    // Maintain aspect ratio, never upscale
          withoutEnlargement: true,
        })
        .webp({ quality: TARGET_QUALITY })
        .toFile(outputPath);

      const newStat = fs.statSync(outputPath);
      const newKB = (newStat.size / 1024).toFixed(1);
      const saving = (((originalStat.size - newStat.size) / originalStat.size) * 100).toFixed(0);

      totalOriginalSize += originalStat.size;
      totalNewSize += newStat.size;

      // If the output is a different filename, remove the original (only if it differs)
      if (outputFile !== file) {
        fs.unlinkSync(inputPath);
      }

      results.push({ file, outputFile, originalKB, newKB, saving });
      console.log(`✅ ${file.padEnd(35)} ${originalKB.padStart(8)} KB → ${newKB.padStart(6)} KB  (${saving}% saved)`);
    } catch (err) {
      console.error(`❌ Failed: ${file} — ${err.message}`);
    }
  }

  const totalOriginalMB = (totalOriginalSize / 1024 / 1024).toFixed(2);
  const totalNewMB = (totalNewSize / 1024 / 1024).toFixed(2);
  const totalSaving = (((totalOriginalSize - totalNewSize) / totalOriginalSize) * 100).toFixed(0);

  console.log('\n' + '='.repeat(65));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(65));
  console.log(`   Images processed : ${results.length}`);
  console.log(`   Original size    : ${totalOriginalMB} MB`);
  console.log(`   Optimized size   : ${totalNewMB} MB`);
  console.log(`   Total savings    : ${(totalOriginalSize - totalNewSize) / 1024 / 1024 > 0 ? ((totalOriginalSize - totalNewSize) / 1024 / 1024).toFixed(2) : '0'} MB (${totalSaving}%)`);
  console.log('='.repeat(65));
  console.log('\n✅ Done! All images converted to WebP.\n');
}

optimizeImages().catch(console.error);
