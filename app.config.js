// Completa o app.json com a identificacao da versao (exibida na tela "Sobre o App").
// O hash e lido do Git no momento do build, entao o APK aponta para o commit exato do codigo.
const { execSync } = require('child_process');

function git(comando) {
  try {
    return execSync(`git ${comando}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
}

const commit = process.env.SOLIN_COMMIT || git('rev-parse HEAD') || 'desconhecido';
const alteracoesPendentes = git('status --porcelain --untracked-files=no') !== '';

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commit,
    commitCurto: commit.slice(0, 7),
    commitData: git('log -1 --format=%cI'),
    // build feito com arquivos alterados e sem commit: a tela avisa que nao e a versao oficial
    alteracoesPendentes,
    dataBuild: new Date().toISOString(),
  },
});
