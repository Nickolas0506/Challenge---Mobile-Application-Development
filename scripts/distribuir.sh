#!/usr/bin/env bash
# Publica um APK na distribuicao da API SOLIN e convida testadores
# (equivalente ao "firebase appdistribution:distribute --testers").
#
# Uso:
#   SOLIN_ADMIN_TOKEN=... ./scripts/distribuir.sh caminho/do/app.apk professor@fiap.com.br [outro@email ...]
#
# Variaveis opcionais:
#   SOLIN_API_URL  endereco da API (padrao: apiUrlProducao do app.json)
#   SOLIN_VERSAO   versao do app (padrao: "version" do app.json)
#   SOLIN_NOTAS    notas da versao
set -euo pipefail

cd "$(dirname "$0")/.."

APK="${1:?informe o caminho do APK}"
shift
[ -f "$APK" ] || { echo "APK nao encontrado: $APK" >&2; exit 1; }
: "${SOLIN_ADMIN_TOKEN:?defina SOLIN_ADMIN_TOKEN}"

API="${SOLIN_API_URL:-$(node -p "require('./app.json').expo.extra.apiUrlProducao")}"
API="${API%/}"
VERSAO="${SOLIN_VERSAO:-$(node -p "require('./app.json').expo.version")}"
COMMIT="$(git rev-parse HEAD)"
NOTAS="${SOLIN_NOTAS:-$(git log -1 --format=%s)}"

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "Aviso: ha alteracoes sem commit; o APK pode nao bater com o commit $COMMIT." >&2
fi

echo "Publicando versao $VERSAO (commit ${COMMIT:0:7}) em $API ..."
curl -fsS -X POST "$API/distribuicao/admin/versoes" \
  -H "X-Admin-Token: $SOLIN_ADMIN_TOKEN" \
  -F "apk=@$APK" -F "versao=$VERSAO" -F "commit=$COMMIT" -F "notas=$NOTAS"
echo

for EMAIL in "$@"; do
  echo "Convidando $EMAIL ..."
  curl -fsS -X POST "$API/distribuicao/admin/testadores" \
    -H "X-Admin-Token: $SOLIN_ADMIN_TOKEN" -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\"}"
  echo
done

echo "Pronto. Links de convite e downloads: $API/distribuicao/painel"
