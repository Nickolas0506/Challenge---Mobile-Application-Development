/**
 * Servidor do QR (porta 5500). Use: npm run qr ou abrir-qr.bat
 * NAO abra expo-qr.html direto no Explorer.
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
const EXPO_PORT = 8081;

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

/** Expo Go no iOS: URL tunnel sem :80 nem :443 (igual ao terminal do expo start). */
function normalizarUrlExp(url) {
  if (!url || !url.startsWith('exp://')) return url;
  try {
    const u = new URL(url);
    if (u.hostname.endsWith('.exp.direct')) {
      u.port = '';
    }
    return u.toString().replace(/\/$/, '');
  } catch {
    return url.replace(/:80$/, '').replace(/:443$/, '');
  }
}

function buscarUrlNoMetro() {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: EXPO_PORT,
        path: '/_expo/link',
        method: 'GET',
        headers: { 'expo-platform': 'ios' },
        timeout: 2500,
      },
      (res) => {
        const loc = res.headers.location;
        if (loc && loc.startsWith('exp://')) {
          resolve(normalizarUrlExp(loc));
          return;
        }
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          const m = body.match(/exp:\/\/[^\s"'<>]+/);
          resolve(m ? normalizarUrlExp(m[0]) : null);
        });
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
  const expoOnline = await portaAberta(EXPO_PORT);

  if (expoOnline) {
    const doMetro = await buscarUrlNoMetro();
    if (doMetro) {
      const modo = doMetro.includes('.exp.direct') ? 'tunnel' : 'lan';
      return { url: doMetro, modo, online: true, fonte: 'metro' };
    }
  }

  const info = lerJson(path.join(ROOT, '.expo', 'packager-info.json'));
  if (info?.expoGoTunnelUrl) {
    return {
      url: normalizarUrlExp(info.expoGoTunnelUrl),
      modo: 'tunnel',
      online: expoOnline,
      fonte: 'packager',
    };
  }
  if (info?.packagerUrl) {
    return {
      url: normalizarUrlExp(info.packagerUrl),
      modo: 'lan',
      online: expoOnline,
      fonte: 'packager',
    };
  }

  const settings = lerJson(path.join(ROOT, '.expo', 'settings.json'));
  const rand = settings?.urlRandomness?.toLowerCase?.();
  if (rand) {
    return {
      url: `exp://${rand}-anonymous-${EXPO_PORT}.exp.direct`,
      modo: 'tunnel',
      online: expoOnline,
      fonte: 'settings',
      aviso: expoOnline
        ? null
        : 'Rode: npx expo start --tunnel --go e espere Tunnel ready',
    };
  }

  const ip = ipLocal();
  return {
    url: `exp://${ip}:${EXPO_PORT}`,
    modo: 'lan',
    online: expoOnline,
    fonte: 'ip',
    aviso: expoOnline ? null : 'Rode: npm start e espere o Metro subir',
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
    servirHtml(res, await obterUrlExpo());
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  const url = 'http://localhost:' + PORT;
  console.log('');
  console.log('  SOLIN — QR Expo Go');
  console.log('  -----------------');
  console.log('  Pagina: ' + url);
  console.log('');
  console.log('  1) Terminal A: npx expo start --tunnel --go');
  console.log('     (espere "Tunnel ready" antes de escanear)');
  console.log('  2) Terminal B: npm run qr  (esta janela)');
  console.log('  3) Escaneie o QR em ' + url);
  console.log('');
  if (process.platform === 'win32') {
    exec('start "" "' + url + '"');
  }
});
