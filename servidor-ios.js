/**
 * Pagina QR: http://localhost:5500
 * Use junto com: npm start (iniciar.bat)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const net = require('net');
const { exec } = require('child_process');

const PORT = 5500;
const ROOT = __dirname;
const EXPO_PORT = 8081;

function ipLocal() {
  for (const nets of Object.values(os.networkInterfaces())) {
    for (const n of nets || []) {
      if (n.family === 'IPv4' && !n.internal) return n.address;
    }
  }
  return null;
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

  if (!online) {
    return {
      url: null,
      online: false,
      mensagem: 'Expo parado. Rode iniciar.bat e espere o QR no terminal.',
    };
  }

  const ip = ipLocal();
  if (ip) {
    return {
      url: `exp://${ip}:${EXPO_PORT}`,
      online: true,
      mensagem: 'Escaneie (mesma Wi-Fi no iPhone)',
    };
  }

  return {
    url: `exp://127.0.0.1:${EXPO_PORT}`,
    online: true,
    mensagem: 'Escaneie com a Camera do iPhone',
  };
}

function injetarBoot(html, dados) {
  const json = JSON.stringify(dados);
  return html.replace(
    /<script type="application\/json" id="boot-data">[\s\S]*?<\/script>/,
    `<script type="application/json" id="boot-data">${json}</script>`
  );
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

    const html = injetarBoot(fs.readFileSync(path.join(ROOT, 'expo-qr.html'), 'utf8'), dados);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(html);
  })
  .listen(PORT, () => {
    console.log('');
    console.log('  Pagina QR: http://localhost:' + PORT);
    console.log('  O Expo precisa estar rodando (iniciar.bat).');
    console.log('');
    if (process.platform === 'win32') {
      exec('start "" "http://localhost:' + PORT + '"');
    }
  });
