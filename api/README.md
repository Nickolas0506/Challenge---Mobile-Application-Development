# SOLIN API (Spring Boot)

API Java do SOLIN: cadastro/login com JWT, CRUD dos dados do app e alertas automaticos.

## Endpoints

| Método | Rota | Auth |
|:-------|:-----|:-----|
| POST | `/api/auth/cadastrar` | livre |
| POST | `/api/auth/login` | livre |
| GET | `/api/auth/me` | JWT |
| GET/POST/PUT/DELETE | `/api/pets` | JWT |
| GET/POST/PUT/DELETE | `/api/checkins` | JWT |
| GET/POST/PUT/DELETE | `/api/passeios` | JWT |
| GET/POST/PUT/DELETE | `/api/alertas` | JWT |
| GET/POST/PUT/DELETE | `/api/eventosIot` | JWT |
| GET | `/saude` | livre (health check) |
| GET | `/distribuicao/ultima` | livre |
| GET | `/distribuicao/convites/{codigo}` (+ `/versoes/{id}/apk`) | link de convite |
| GET/POST/DELETE | `/distribuicao/admin/testadores`, `/versoes`, `/downloads` | `X-Admin-Token` |

Banco H2 em arquivo (`data/solin`). Console: `http://localhost:8080/h2-console`.

Subir: na pasta `app`, `npm run api` ou `mvn -f api/pom.xml spring-boot:run`.

## Alertas automaticos (4ª sprint)

`MonitorSaudeService` analisa cada registro novo e grava um alerta em `/api/alertas`.
O app consulta essa rota e mostra uma **notificacao** para cada alerta novo.

| Evento | Regra | Alerta |
|:-------|:------|:-------|
| Passeio | nao urinou, urina/fezes/comportamento alterados ou nao bebeu agua | "Atencao apos o passeio de {pet}" |
| Check-in | humor `ruim` | "{pet} nao esta bem hoje" |
| Sensor PIR | 8 usos em 24h | "Uso excessivo da caixa de areia" |
| Sensor PIR | evento `sem_uso` | "Caixa de areia sem uso" |

## Distribuicao do APK (4ª sprint)

Substitui o Firebase App Distribution (autorizado pelo professor). O APK fica no banco (`arquivos_apk`),
cada testador tem um codigo de convite e todo download e registrado (`downloads_apk`).

- Pagina do testador: `/distribuicao/?c=CODIGO`
- Painel do admin: `/distribuicao/painel` (pede o `SOLIN_ADMIN_TOKEN`)
- Script: `scripts/distribuir.sh app-release.apk professor@fiap.com.br`

Sem `SOLIN_ADMIN_TOKEN` as rotas de admin respondem 503.

## Producao (Railway)

`Dockerfile` nesta pasta. Variaveis:

| Variavel | Valor |
|:---------|:------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://HOST:PORTA/BANCO` |
| `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` | usuario e senha do PostgreSQL |
| `SOLIN_JWT_SECRET` | chave do JWT (32+ caracteres) |
| `SOLIN_H2_CONSOLE` | `false` |
| `SOLIN_ADMIN_TOKEN` | senha do painel de distribuicao |
| `SOLIN_URL_PUBLICA` | opcional: endereco usado nos links de convite |

`PORT` e definido pelo Railway.
