const fs = require('node:fs/promises');
const sharp = require('C:/Users/elias/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

(async () => {
  const source = 'C:/Users/elias/Downloads/unnamed.png';
  const metadata = await sharp(source).metadata();
  if (metadata.width !== 512 || metadata.height !== 512) throw new Error('Expected the supplied 512×512 icon');
  await fs.copyFile(source, 'public/icon-512.png');
  await sharp(source).resize(192, 192, { kernel: 'lanczos3' }).png().toFile('public/icon-192.png');
  for (const size of [192, 512]) {
    const result = await sharp(`public/icon-${size}.png`).metadata();
    if (result.width !== size || result.height !== size || result.format !== 'png') throw new Error(`Invalid ${size}px icon`);
  }
  console.log('Created 192×192 icon; preserved the supplied 512×512 icon unchanged.');
})().catch(error => { console.error(error); process.exit(1); });
