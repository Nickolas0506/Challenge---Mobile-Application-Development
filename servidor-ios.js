/**
 * QR na tela do PC — npm run qr (opcional)
 * O QR so aparece com Expo rodando (npm start).
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
    s.setTimeout(600, () => {
      s.destroy();
      resolve(false);
    });
  });
}

function urlDoMetro() {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: EXPO_PORT,
        path: '/_expo/link',
        headers: { 'expo-platform': 'ios' },
        timeout: 2000,
      },
      (res) => {
        const loc = res.headers.location;
        resolve(loc?.startsWith('exp://') ? loc : null);
      }
    );
    req.on('error', () => resolve(null));
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });
    req.end();
  });
}

async function obterUrlExpo() {
  const online = await portaAberta(EXPO_PORT);

  if (!online) {
    return {
      url: null,
      online: false,
      mensagem: 'Rode npm start e espere o QR no terminal',
    };
  }

  const doMetro = await urlDoMetro();
  if (doMetro) {
    return { url: doMetro, online: true };
  }

  const ip = ipLocal();
  if (ip) {
    return {
      url: `exp://${ip}:${EXPO_PORT}`,
      online: true,
      mensagem: 'Escaneie (PC e celular na mesma Wi-Fi)',
    };
  }

  return {
    url: null,
    online: true,
    mensagem: 'Use o QR do terminal do Expo',
  };
}

http
  .createServer(async (req, res) => {
    const rota = (req.url || '').split('?')[0];
    const dados = await obterUrlExpo();

    if (rota === '/api/url') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(dados));
      return;
    }

    let html = fs.readFileSync(path.join(ROOT, 'expo-qr.html'), 'utf8');
    html = html.replace('/*__EXPO_BOOT__*/', JSON.stringify(dados));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  })
  .listen(PORT, () => {
    console.log('http://localhost:' + PORT);
    console.log('Antes: npm start');
    if (process.platform === 'win32') exec('start "" "http://localhost:' + PORT + '"');
  });
