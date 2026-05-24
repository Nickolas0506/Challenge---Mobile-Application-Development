/**
 * Sobe o Expo, detecta IP ou tunnel, gera qr.html com link para CadastroPet.
 */
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const QRCode = require('qrcode');

const ROOT = __dirname;
const PORT = 8081;
const HTML = path.join(ROOT, 'qr.html');

function obterIpDoPc() {
  const preferidos = ['Wi-Fi', 'Wi-Fi 2', 'Ethernet', 'Ethernet 2'];
  const ifaces = os.networkInterfaces();

  for (const nome of preferidos) {
    const ip = extrairIp(ifaces[nome]);
    if (ip) return { ip, iface: nome };
  }
  for (const [nome, lista] of Object.entries(ifaces)) {
    const ip = extrairIp(lista);
    if (ip) return { ip, iface: nome };
  }
  throw new Error('Conecte o PC ao Wi-Fi antes de gerar o QR.');
}

function extrairIp(lista) {
  if (!lista) return null;
  for (const net of lista) {
    if (net.family !== 'IPv4' || net.internal) continue;
    if (/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(net.address)) {
      return net.address;
    }
  }
  return null;
}

function liberarPorta() {
  try {
    const out = execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8', windowsHide: true });
    const pids = new Set();
    for (const linha of out.split('\n')) {
      if (!linha.includes('LISTENING')) continue;
      const pid = linha.trim().split(/\s+/).pop();
      if (pid && /^\d+$/.test(pid)) pids.add(pid);
    }
    for (const pid of pids) {
      execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore', windowsHide: true });
    }
  } catch (_) {}
}

function firewallAdmin() {
  const ps = [
    `netsh advfirewall firewall add rule name=SOLIN_TCP_${PORT} dir=in action=allow protocol=TCP localport=${PORT}`,
    `netsh advfirewall firewall add rule name=SOLIN_UDP_${PORT} dir=in action=allow protocol=UDP localport=${PORT}`,
    `netsh advfirewall firewall add rule name=SOLIN_NODE dir=in action=allow program="${process.execPath}" enable=yes profile=any`,
    `netsh advfirewall firewall add rule name=SOLIN_NODE2 dir=in action=allow program="C:\\Program Files\\nodejs\\node.exe" enable=yes profile=any`,
  ].join('; ');
  try {
    execSync(`powershell -NoProfile -Command "${ps}"`, { stdio: 'ignore', windowsHide: true });
  } catch (_) {}
  try {
    execSync(
      `powershell -StartProcess -Verb RunAs -Wait -ArgumentList '-NoProfile','-Command','${ps.replace(/'/g, "''")}'`,
      { stdio: 'ignore', timeout: 60000 }
    );
  } catch (_) {}
}

function httpGet(url, timeout = 4000) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => resolve({ ok: true, status: res.statusCode, body: d }));
    });
    req.on('error', (e) => resolve({ ok: false, error: e.message }));
    req.setTimeout(timeout, () => {
      req.destroy();
      resolve({ ok: false, error: 'timeout' });
    });
  });
}

async function metroOnline() {
  const r = await httpGet(`http://127.0.0.1:${PORT}/status`);
  return r.ok && (r.body.includes('running') || r.status === 200);
}

async function lanAcessivel(ip) {
  const r = await httpGet(`http://${ip}:${PORT}/status`, 5000);
  return r.ok && (r.body.includes('running') || r.status === 200);
}

function extrairExpDoLog(texto) {
  const limpo = texto.replace(/\u001b\[[0-9;]*m/g, '');
  const urls = limpo.match(/exp:\/\/[^\s"'<>\]]+/g);
  if (!urls) return null;
  const tunnel = urls.find((u) => u.includes('exp.direct') || u.includes('expo.dev'));
  return (tunnel || urls[urls.length - 1]).replace(/[)\],]+$/, '');
}

async function urlNgrok() {
  const r = await httpGet('http://127.0.0.1:4040/api/tunnels');
  if (!r.ok) return null;
  try {
    const json = JSON.parse(r.body);
    const t = json.tunnels?.find((x) => x.proto === 'https') || json.tunnels?.[0];
    if (!t?.public_url) return null;
    const u = new URL(t.public_url);
    return normalizarExpUrl(`exp://${u.hostname}`);
  } catch {
    return null;
  }
}

/** Expo Go + tunnel usam porta 80 no exp.direct (443 quebra no iPhone). */
function normalizarExpUrl(url) {
  const raw = String(url).trim();
  const m = raw.match(/^exp:\/\/([^/?#]+)/);
  if (!m) return raw;
  const hostPort = m[1];
  const host = hostPort.split(':')[0];
  if (host.includes('exp.direct')) return `exp://${host}:80`;
  const port = hostPort.includes(':') ? hostPort.split(':')[1] : String(PORT);
  return `exp://${host}:${port}`;
}

function configurarEnv(modo, ip) {
  const linhas = ['EXPO_PUBLIC_VIA_QR=1'];
  if (modo === 'lan') linhas.push(`REACT_NATIVE_PACKAGER_HOSTNAME=${ip}`);
  fs.writeFileSync(path.join(ROOT, '.env'), linhas.join('\n') + '\n');
}

function logoBase64() {
  const arquivo = path.join(ROOT, 'assets', 'logo-solin.png');
  if (!fs.existsSync(arquivo)) return null;
  return `data:image/png;base64,${fs.readFileSync(arquivo).toString('base64')}`;
}

async function gerarPaginaQr(expUrl, info) {
  const logo = logoBase64();
  const img = await QRCode.toDataURL(expUrl, {
    width: 560,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#ffffff' },
  });

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>SOLIN — QR Code</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f4ef;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      padding: 32px 20px;
    }
    .card {
      text-align: center;
      background: #fff;
      border-radius: 28px;
      padding: 40px 36px 44px;
      box-shadow: 0 8px 32px rgba(30, 90, 77, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04);
      max-width: 520px;
      width: 100%;
    }
    .logo {
      display: block;
      width: min(70vw, 280px);
      height: auto;
      margin: 0 auto 24px;
    }
    .qr {
      display: inline-block;
      padding: 16px;
      background: #fff;
      border: 3px solid #e0ebe7;
      border-radius: 20px;
    }
    .qr img {
      display: block;
      width: min(72vmin, 380px);
      height: min(72vmin, 380px);
    }
  </style>
</head>
<body>
  <div class="card">
    ${logo ? `<img class="logo" src="${logo}" alt="SOLIN" />` : '<h1 style="font-size:2rem;color:#2e7d6b;margin-bottom:24px">SOLIN</h1>'}
    <div class="qr"><img src="${img}" alt="QR Code SOLIN" /></div>
  </div>
</body>
</html>`;

  fs.writeFileSync(HTML, html, 'utf8');
  return HTML;
}

function abrirHtml() {
  if (process.platform === 'win32') {
    execSync(`start "" "${HTML}"`, { stdio: 'ignore', shell: true });
  }
}

function iniciarExpo(args, env) {
  return spawn('npx', args, {
    cwd: ROOT,
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env,
  });
}

async function aguardarMetro(maxMs = 120000) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    if (await metroOnline()) return true;
    await new Promise((r) => setTimeout(r, 1500));
  }
  return false;
}

async function subirTunnel(ip) {
  console.log('\n  [1/2] Tunnel (recomendado — evita timeout no iPhone)...\n');

  configurarEnv('tunnel', ip);
  const env = {
    ...process.env,
    CI: '0',
    EXPO_NO_TELEMETRY: '1',
    EXPO_PUBLIC_VIA_QR: '1',
  };
  delete env.REACT_NATIVE_PACKAGER_HOSTNAME;

  const proc = iniciarExpo(['expo', 'start', '--go', '--tunnel', '--port', String(PORT)], env);
  let log = '';
  let url = null;

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (!url) {
        proc.kill('SIGTERM');
        reject(new Error('tunnel_timeout'));
      }
    }, 150000);

    const poll = setInterval(async () => {
      if (url) return;
      const doLog = extrairExpDoLog(log);
      if (doLog) {
        url = normalizarExpUrl(doLog);
        clear();
        return resolve({ proc, url, modo: 'tunnel' });
      }
      if (/Tunnel ready/i.test(log)) {
        const ng = await urlNgrok();
        if (ng) {
          url = ng;
          clear();
          return resolve({ proc, url, modo: 'tunnel' });
        }
      }
    }, 2000);

    function clear() {
      clearTimeout(timeout);
      clearInterval(poll);
    }

    function onData(chunk) {
      const t = chunk.toString();
      process.stdout.write(t);
      log += t;
      if (log.length > 40000) log = log.slice(-40000);
      if (/failed to start tunnel|remote gone away/i.test(log) && !url) {
        clear();
        proc.kill('SIGTERM');
        reject(new Error('tunnel_failed'));
      }
    }

    proc.stdout.on('data', onData);
    proc.stderr.on('data', onData);
    proc.on('exit', (code) => {
      if (!url) {
        clear();
        reject(new Error('expo_exit_' + code));
      }
    });
  });
}

async function subirLan(ip, iface) {
  console.log('\n  [2/2] Rede local (Wi-Fi)...\n');

  configurarEnv('lan', ip);
  const env = {
    ...process.env,
    CI: '0',
    EXPO_PUBLIC_VIA_QR: '1',
    REACT_NATIVE_PACKAGER_HOSTNAME: ip,
  };

  const proc = iniciarExpo(['expo', 'start', '--go', '--lan', '--port', String(PORT)], env);
  let log = '';

  proc.stdout.on('data', (c) => {
    const t = c.toString();
    process.stdout.write(t);
    log += t;
  });
  proc.stderr.on('data', (c) => process.stdout.write(c.toString()));

  const ok = await aguardarMetro();
  if (!ok) {
    proc.kill();
    throw new Error('metro_timeout');
  }

  const doLog = extrairExpDoLog(log);
  const base = normalizarExpUrl(doLog || `exp://${ip}:${PORT}`);
  return { proc, url: base, modo: 'lan', iface, ip };
}

async function main() {
  const { ip, iface } = obterIpDoPc();

  console.log('\n  SOLIN — QR → Cadastro do pet\n');
  console.log(`  IP do PC: ${ip} (${iface})\n`);

  liberarPorta();
  firewallAdmin();

  let resultado;

  let tunnelErro = null;
  for (let tentativa = 1; tentativa <= 2; tentativa++) {
    try {
      if (tentativa > 1) {
        console.log('\n  Nova tentativa de tunnel...\n');
        liberarPorta();
        await new Promise((r) => setTimeout(r, 3000));
      }
      resultado = await subirTunnel(ip);
      await aguardarMetro(30000);
      await new Promise((r) => setTimeout(r, 4000));
      tunnelErro = null;
      break;
    } catch (e) {
      tunnelErro = e;
      liberarPorta();
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (tunnelErro) {
    console.log(`\n  Tunnel indisponível (${tunnelErro.message}). Usando Wi-Fi local...\n`);
    console.log('  IMPORTANTE: rode liberar-firewall-admin.bat como Administrador.\n');
    liberarPorta();
    await new Promise((r) => setTimeout(r, 2000));
    try {
      resultado = await subirLan(ip, iface);
    } catch (e2) {
      console.error('\n  Não foi possível iniciar o Expo:', e2.message);
      process.exit(1);
    }
  }

  const acessivel = resultado.modo === 'lan' ? await lanAcessivel(ip) : true;

  if (resultado.modo === 'lan' && !acessivel) {
    console.log('\n  AVISO: iPhone pode dar timeout na rede local.');
    console.log('  Rode liberar-firewall-admin.bat como Administrador e tente de novo.\n');
  }

  await gerarPaginaQr(resultado.url, {
    modo: resultado.modo,
    iface: resultado.iface || iface,
    ip,
  });

  abrirHtml();

  console.log('\n========================================');
  console.log('  QR pronto — escaneie com a Câmera');
  console.log('  Tela: Cadastro do pet');
  console.log('  URL:  ' + resultado.url);
  console.log('  Modo: ' + resultado.modo);
  console.log('========================================');
  console.log('\n  Não feche esta janela.\n');

  resultado.proc.stdout?.pipe?.(process.stdout);
  resultado.proc.stderr?.pipe?.(process.stderr);
  resultado.proc.on('exit', (c) => process.exit(c ?? 0));
}

main().catch((e) => {
  console.error('\n  Erro:', e.message, '\n');
  process.exit(1);
});
