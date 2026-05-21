/**
 * Servidor local para exibir o QR do Expo no navegador (porta 5500).
 * Não roda o app SOLIN na web — só facilita escanear com Expo Go no celular.
 *
 * Uso: com "npx expo start" (ou --tunnel) rodando, execute:
 *   node servidor-ios.js
 * Abra: http://localhost:5500
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 5500;
const ROOT = __dirname;

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

function obterUrlExpo() {
  const info = lerJson(path.join(ROOT, '.expo', 'packager-info.json'));
  if (info?.expoGoTunnelUrl) {
    return { url: info.expoGoTunnelUrl, modo: 'tunnel', online: true };
  }
  if (info?.packagerUrl) {
    return { url: info.packagerUrl, modo: 'lan', online: true };
  }

  const settings = lerJson(path.join(ROOT, '.expo', 'settings.json'));
  const rand = settings?.urlRandomness?.toLowerCase?.();
  if (rand) {
    return {
      url: `exp://${rand}-anonymous-8081.exp.direct:80`,
      modo: 'tunnel',
      online: false,
    };
  }

  const ip = ipLocal();
  return {
    url: `exp://${ip}:8081`,
    modo: 'lan',
    online: false,
  };
}

function servirArquivo(res, nome, tipo) {
  const caminho = path.join(ROOT, nome);
  if (!fs.existsSync(caminho)) {
    res.writeHead(404);
    res.end('Arquivo nao encontrado');
    return;
  }
  res.writeHead(200, { 'Content-Type': tipo });
  res.end(fs.readFileSync(caminho));
}

const server = http.createServer((req, res) => {
  const url = req.url?.split('?')[0] || '/';

  if (url === '/api/url') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify(obterUrlExpo()));
    return;
  }

  if (url === '/' || url === '/expo-qr.html') {
    servirArquivo(res, 'expo-qr.html', 'text/html; charset=utf-8');
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log('');
  console.log('  SOLIN — pagina do QR (preview Expo Go)');
  console.log('  ----------------------------------------');
  console.log('  1. Deixe o Expo rodando: npm start');
  console.log('  2. Abra no navegador: http://localhost:' + PORT);
  console.log('  3. Escaneie o QR com a Camera (iPhone) ou Expo Go (Android)');
  console.log('');
});
