# SOLIN API (Spring Boot)

API Java da 3ª sprint: cadastro/login com JWT e CRUD dos dados do app.

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

Banco H2 em arquivo (`data/solin`). Console: `http://localhost:8080/h2-console`.

Subir: na pasta `app`, `npm run api` ou `mvn -f api/pom.xml spring-boot:run`.
