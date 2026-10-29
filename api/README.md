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

## Producao (Railway)

`Dockerfile` nesta pasta. Variaveis:

| Variavel | Valor |
|:---------|:------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://HOST:PORTA/BANCO` |
| `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` | usuario e senha do PostgreSQL |
| `SOLIN_JWT_SECRET` | chave do JWT (32+ caracteres) |
| `SOLIN_H2_CONSOLE` | `false` |

`PORT` e definido pelo Railway.
