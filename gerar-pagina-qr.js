/**
 * Gera qr-solin.html com QR embutido (abre com duplo clique).
 * Uso: node gerar-pagina-qr.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const net = require('net');
const QRCode = require('qrcode');
const { exec } = require('child_process');

const EXPO_PORT = 8081;
const SAIDA = path.join(__dirname, 'expo-qr.html');

function ipLocal() {
  for (const nets of Object.values(os.networkInterfaces())) {
    for (const n of nets || []) {
      if (n.family === 'IPv4' && !n.internal) return n.address;
    }
  }
  return '127.0.0.1';
}

function expoRodando() {
  return new Promise((resolve) => {
    const s = net.createConnection({ port: EXPO_PORT, host: '127.0.0.1' }, () => {
      s.end();
      resolve(true);
    });
    s.on('error', () => resolve(false));
    s.setTimeout(400, () => {
      s.destroy();
      resolve(false);
    });
  });
}

async function main() {
  const ip = ipLocal();
  const url = `exp://${ip}:${EXPO_PORT}`;
  const online = await expoRodando();

  const dataUrl = await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: { dark: '#2e7d6b', light: '#ffffff' },
  });

  const aviso = online
    ? 'Expo rodando — escaneie agora (mesma Wi-Fi)'
    : 'IMPORTANTE: abra iniciar.bat ou rode npm start ANTES de escanear';

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SOLIN — QR</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, sans-serif;
      background: #2e7d6b;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    main {
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      max-width: 340px;
      width: 100%;
    }
    h1 { color: #2e7d6b; font-size: 32px; margin-bottom: 8px; }
    .aviso { font-size: 14px; color: ${online ? '#2e7d6b' : '#c45a3a'}; font-weight: 600; margin-bottom: 16px; line-height: 1.4; }
    img { display: block; margin: 0 auto 12px; border-radius: 8px; }
    .link { font-size: 12px; color: #666; word-break: break-all; user-select: all; }
  </style>
</head>
<body>
  <main>
    <h1>SOLIN</h1>
    <p class="aviso">${aviso}</p>
    <img src="${dataUrl}" width="300" height="300" alt="QR Code" />
    <p class="link">${url}</p>
  </main>
</body>
</html>`;

  fs.writeFileSync(SAIDA, html, 'utf8');

  console.log('');
  console.log('  QR gerado: ' + SAIDA);
  console.log('  URL: ' + url);
  console.log('  Expo: ' + (online ? 'ONLINE' : 'OFFLINE - rode npm start'));
  console.log('');

  if (process.platform === 'win32') {
    exec('start "" "' + SAIDA + '"');
  }
}

main().catch((e) => {
  console.error('Erro:', e.message);
  process.exit(1);
});
