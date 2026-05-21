/**
 * Servidor local para exibir o QR do Expo no navegador (porta 5500).
 * NAO abra expo-qr.html com duplo clique — use: npm run qr ou abrir-qr.bat
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const net = require('net');
const { exec } = require('child_process');

const PORT = 5500;
const ROOT = __dirname;
const HTML_PATH = path.join(ROOT, 'expo-qr.html');

function lerJson(caminho) {
  try {
    return JSON.parse(fs.readFileSync(caminho, 'utf8'));
  } catch {
    return null;
  }
}

function ipLocal() {
  const nets = os.networkInterfaces();
  for (const nome of Object.keys(nets)) {
    for (const net of nets[nome] || []) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
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
    s.setTimeout(800, () => {
      s.destroy();
      resolve(false);
    });
  });
}

async function obterUrlExpo() {
  const expoOnline = await portaAberta(8081);

  const info = lerJson(path.join(ROOT, '.expo', 'packager-info.json'));
  if (info?.expoGoTunnelUrl) {
    return { url: info.expoGoTunnelUrl, modo: 'tunnel', online: expoOnline };
  }
  if (info?.packagerUrl) {
    return { url: info.packagerUrl, modo: 'lan', online: expoOnline };
  }

  const settings = lerJson(path.join(ROOT, '.expo', 'settings.json'));
  const rand = settings?.urlRandomness?.toLowerCase?.();
  if (rand) {
    return {
      url: `exp://${rand}-anonymous-8081.exp.direct:80`,
      modo: 'tunnel',
      online: expoOnline,
    };
  }

  const ip = ipLocal();
  return {
    url: `exp://${ip}:8081`,
    modo: 'lan',
    online: expoOnline,
  };
}

function servirHtml(res, dados) {
  let html = fs.readFileSync(HTML_PATH, 'utf8');
  const json = JSON.stringify(dados).replace(/</g, '\\u003c');
  html = html.replace('/*__EXPO_BOOT__*/', json);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

const server = http.createServer(async (req, res) => {
  const rota = req.url?.split('?')[0] || '/';

  if (rota === '/api/url') {
    const dados = await obterUrlExpo();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify(dados));
    return;
  }

  if (rota === '/' || rota === '/expo-qr.html') {
    const dados = await obterUrlExpo();
    servirHtml(res, dados);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  const url = 'http://localhost:' + PORT;
  console.log('');
  console.log('  SOLIN — QR no navegador');
  console.log('  -----------------------');
  console.log('  Pagina: ' + url);
  console.log('  (nao abra expo-qr.html direto pelo Explorer)');
  console.log('');
  console.log('  Terminal 1: npm start  (ou npx expo start --tunnel)');
  console.log('  Terminal 2: npm run qr  (esta janela)');
  console.log('');
  if (process.platform === 'win32') {
    exec('start "" "' + url + '"');
  }
});
