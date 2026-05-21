/**
 * Pagina QR: http://localhost:5500  |  npm run qr  |  abrir-qr.bat
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const net = require('net');
const QRCode = require('qrcode');
const { exec } = require('child_process');

const PORT = 5500;
const ROOT = __dirname;
const EXPO_PORT = 8081;
const HTML_PATH = path.join(ROOT, 'expo-qr.html');

function ipLocal() {
  for (const nets of Object.values(os.networkInterfaces())) {
    for (const n of nets || []) {
      if (n.family === 'IPv4' && !n.internal) return n.address;
    }
  }
  return '127.0.0.1';
}

function portaAberta(porta) {
  return new Promise((resolve) => {
    const s = net.createConnection({ port: porta, host: '127.0.0.1' }, () => {
      s.end();
      resolve(true);
    });
    s.on('error', () => resolve(false));
    s.setTimeout(500, () => {
      s.destroy();
      resolve(false);
    });
  });
}

async function obterUrlExpo() {
  const online = await portaAberta(EXPO_PORT);
  const ip = ipLocal();
  const url = `exp://${ip}:${EXPO_PORT}`;

  return {
    url,
    online,
    mensagem: online
      ? 'Escaneie com a Camera do iPhone (mesma Wi-Fi)'
      : 'Escaneie o QR — depois rode npm start',
  };
}

async function gerarHtml(dados) {
  const dataUrl = await QRCode.toDataURL(dados.url, {
    width: 280,
    margin: 2,
    color: { dark: '#2e7d6b', light: '#ffffff' },
  });

  const img = `<img src="${dataUrl}" width="280" height="280" alt="QR Code SOLIN" />`;

  return fs
    .readFileSync(HTML_PATH, 'utf8')
    .replace('<!-- QR_AQUI -->', img)
    .replace('<!-- STATUS -->', dados.mensagem || '');
}

http
  .createServer(async (req, res) => {
    const rota = (req.url || '').split('?')[0];
    const dados = await obterUrlExpo();

    if (rota === '/api/url') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(dados));
      return;
    }

    const html = await gerarHtml(dados);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(html);
  })
  .listen(PORT, () => {
    const ip = ipLocal();
    console.log('');
    console.log('  QR na tela: http://localhost:' + PORT);
    console.log('  Link: exp://' + ip + ':' + EXPO_PORT);
    console.log('');
    if (process.platform === 'win32') {
      exec('start "" "http://localhost:' + PORT + '"');
    }
  });
