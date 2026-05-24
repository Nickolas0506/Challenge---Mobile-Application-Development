/**
 * Troca o fundo bege (e manchas escuras nas bordas) pelo verde do app.
 * O flatten do sharp nao funciona aqui: o bege e opaco, nao transparente.
 * Uso: node scripts/logo-fundo-transparente.js
 */
const path = require('path');
const sharp = require('sharp');

const entrada = path.join(__dirname, '../assets/logo-solin-original.png');
const saida = path.join(__dirname, '../assets/logo-solin.png');

const VERDE = [46, 125, 107];
const BEGE = [233, 233, 220];

function ehMarca(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max - min;

  if (sat < 12) return false;

  if (r > 150 && g > 95 && b < 130 && r >= g) return true;
  if (g > r + 12 && g > 85) return true;
  if (max < 130 && sat > 18 && (g > 45 || b > 45)) return true;

  return false;
}

function forcaFundo(r, g, b) {
  const d = Math.hypot(r - BEGE[0], g - BEGE[1], b - BEGE[2]);
  if (d < 72) {
    if (d < 28) return 1;
    return (72 - d) / 44;
  }

  if (r > 218 && g > 218 && b > 205 && Math.abs(r - g) < 18) {
    return 0.95;
  }

  const neutro = maxMin(r, g, b);
  if (neutro.max < 100 && neutro.sat < 22) {
    return neutro.max < 75 ? 1 : 0.85;
  }

  return 0;
}

function maxMin(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return { max, min, sat: max - min };
}

async function main() {
  const { data, info } = await sharp(entrada).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (ehMarca(r, g, b)) continue;

    const t = forcaFundo(r, g, b);
    if (t <= 0) continue;

    data[i] = Math.round(r + (VERDE[0] - r) * t);
    data[i + 1] = Math.round(g + (VERDE[1] - g) * t);
    data[i + 2] = Math.round(b + (VERDE[2] - b) * t);
    data[i + 3] = 255;
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 6 })
    .toFile(saida);

  const meta = await sharp(saida).metadata();
  console.log('Logo fundo verde:', meta.width, 'x', meta.height);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
