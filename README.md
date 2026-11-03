# SOLIN — App Mobile

<p align="center">
  <strong>Challenge FIAP 2026 · Clyvo Vet</strong><br/>
  <em>O cuidado que protege o seu pet · 4ª Sprint</em>
</p>

## Entrega (professor)

| | Link |
|:---|:---|
| **Repositório** | https://github.com/Nickolas0506/Challenge---Mobile-Application-Development |
| **Vídeo da 4ª Sprint** | _(link do YouTube — adicionar após a gravação)_ |
| **API em produção** | https://solin-api-production.up.railway.app |
| **Distribuição do APK** | versão 1.4.0 · commit `a36d203` · testador: `pf1669@fiap.com.br` (link de convite individual) |
| **Painel de distribuição** | https://solin-api-production.up.railway.app/distribuicao/painel |
| Vídeo da 3ª Sprint | https://youtu.be/vLmsxIUhOj8 |

> **Publicação:** com autorização do professor, o Firebase App Distribution foi substituído por uma
> **distribuição própria na API Java Spring Boot** (mesma função: APK publicado, testadores por e-mail,
> convite individual e registro de quem baixou). Detalhes em [Publicação](#publicação-distribuição-do-apk).

---

## Problema

Tutores de pets costumam perceber mudanças na rotina (apetite, urina, comportamento) tarde demais. Falta um hábito simples de registro diário que alimente o acompanhamento — inclusive com dados de sensor IoT na caixa de areia.

## Solução

O **SOLIN** é o aplicativo do tutor: check-in em poucos toques, registro pós-passeio, cadastro do pet, alertas e histórico. A API Java analisa cada registro e **gera alertas automáticos**, que chegam ao celular como **notificação**.

---

## Equipe

| Nome | RM |
|:-----|:---|
| Nickolas Davi | 564105 |
| Samara Vilela | 566133 |
| Natália Cristina | 564099 |
| Otávio Ferreira | 565960 |
| Rodrigo Carvalho | 565162 |

---

## O que entrou na 4ª Sprint

| Requisito | Como foi atendido | Onde |
|:----------|:------------------|:-----|
| **Publicação do app** | APK de release distribuído pela API Spring Boot, com o e-mail institucional do professor como testador | `api/.../distribuicao/`, `scripts/distribuir.sh` |
| **Tela "Sobre o App"** | Versão, build e **hash do commit** lido do Git no momento do build (mesmo commit do repositório). Mostra também a última versão distribuída e avisa se o APK instalado está desatualizado | `src/screens/SobreScreen.tsx`, `app.config.js` |
| **Notificações reais** | Alerta novo gerado pela API → notificação imediata; lembrete diário de check-in no horário escolhido. Tocar abre a tela certa | `src/hooks/useNotificacoes.ts`, `src/services/notificacaoService.ts` |
| **Tema claro / escuro** | Segue o sistema ou escolha manual em Configurações; todas as telas usam as cores do tema | `src/contexts/TemaContext.tsx`, `src/hooks/useEstilos.ts` |
| **Arquitetura** | UI (`screens`/`components`) × lógica (`lib`/`contexts`) × dados (`services` + hooks com TanStack Query) | ver [Arquitetura](#arquitetura) |
| **Telas anteriores** | Todas as telas da 3ª Sprint continuam no app | ver [Telas](#telas-react-navigation) |

---

## Tecnologias

| Categoria | Ferramenta |
|:----------|:-----------|
| App | React Native + Expo SDK 57 + TypeScript |
| Navegação | React Navigation (Stack + Bottom Tabs) |
| Dados HTTP | TanStack Query (`useQuery` / `useMutation`) |
| Notificações | `expo-notifications` (locais, com canais no Android) |
| API backend | Java 21 + Spring Boot 3 (REST) |
| Banco | PostgreSQL em produção · H2 no desenvolvimento |
| Autenticação | API Java (cadastro/login + JWT) |
| Distribuição | Módulo `distribuicao` da API (APK no banco, convites, registro de downloads) |

---

## Notificações

As notificações nascem de **eventos reais** da API — nada é disparado por botão de teste.

| Evento | Origem | Notificação | Ao tocar |
|:-------|:-------|:------------|:---------|
| Passeio com sinais anormais (não urinou, urina/fezes alteradas, não bebeu água...) | `MonitorSaudeService` grava um alerta | "Atenção após o passeio de {pet}" | abre **Alertas** e marca como lido |
| Check-in com humor *ruim* | `MonitorSaudeService` | "{pet} não está bem hoje" | abre **Alertas** |
| Sensor PIR: 8 usos em 24h ou evento `sem_uso` | `MonitorSaudeService` | "Uso excessivo / sem uso da caixa de areia" | abre **Alertas** |
| Horário do lembrete (Configurações) | agendada no aparelho para os próximos 7 dias | "Como {pet} está hoje?" — não toca no dia em que o check-in já foi feito | abre **Check-in** |

O app consulta `/api/alertas` a cada minuto (TanStack Query `refetchInterval`) e notifica só os alertas que ainda não viu. A aba Alertas mostra um **badge** com os não lidos.

---

## Publicação (distribuição do APK)

Substitui o Firebase App Distribution, com a mesma função, dentro da própria API:

1. O APK de release é enviado para a API junto com a **versão** e o **hash do commit** (fica salvo no PostgreSQL).
2. O professor é cadastrado como **testador** pelo e-mail institucional e recebe um **link de convite** individual.
3. Pelo link ele vê as versões, baixa o APK e instala. Cada download fica registrado (quem, qual versão, quando).
4. Na tela **Sobre o App** o hash do commit é o mesmo mostrado na página de download e no GitHub.

```bash
# publicar o APK e convidar o professor (equivalente ao firebase appdistribution:distribute --testers)
SOLIN_ADMIN_TOKEN=<token> ./scripts/distribuir.sh caminho/app-release.apk professor@fiap.com.br
```

Também dá para fazer tudo pelo **painel** (`/distribuicao/painel`): publicar versão, adicionar testador, copiar o link ou abrir o e-mail de convite já preenchido, e acompanhar os downloads.

| Rota | Acesso | Função |
|:-----|:-------|:-------|
| `GET /distribuicao/?c=CODIGO` | link de convite | página do testador |
| `GET /distribuicao/convites/{codigo}` | link de convite | versões disponíveis |
| `GET /distribuicao/convites/{codigo}/versoes/{id}/apk` | link de convite | download (registrado) |
| `GET /distribuicao/ultima` | livre | última versão (usada na tela Sobre) |
| `GET/POST/DELETE /distribuicao/admin/testadores` | `X-Admin-Token` | testadores |
| `GET/POST/DELETE /distribuicao/admin/versoes` | `X-Admin-Token` | versões (upload multipart) |
| `GET /distribuicao/admin/downloads` | `X-Admin-Token` | histórico de downloads |

---

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [JDK 21+](https://adoptium.net/) e [Maven 3.9+](https://maven.apache.org/)
- App **Expo Go** no celular (mesma Wi-Fi do PC) **ou** emulador

### 1. Instalar

```bash
npm install
```

### 2. Subir API + app

```bash
npm run dev
```

Isso sobe a **API Java** em `http://localhost:8080` e o **Expo**. Ou em dois terminais: `npm run api` e `npm start`.

### 3. Abrir no celular ou emulador

- Escaneie o QR com o **Expo Go** (mesma rede Wi-Fi). A API é descoberta pelo IP da LAN.
- Para forçar o endereço: `EXPO_PUBLIC_API_URL=http://SEU_IP:8080`.
- Notificações: use um **celular/emulador Android** (no navegador elas ficam desligadas).

**Primeiro uso:** crie uma conta na tela **Cadastro** e faça login. A sessão permanece ao reabrir o app.

### 4. Gerar o APK de release

```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

O APK sai em `android/app/build/outputs/apk/release/app-release.apk` e aponta para a API de produção (`extra.apiUrlProducao` no `app.json`). Gere sempre a partir de um commit limpo: se houver alterações sem commit, a tela Sobre avisa que não é a versão oficial.

---

## Telas (React Navigation)

Rotas declaradas em `src/navigation/AppNavigator.tsx`.

### Stack pública (só deslogado)

| Rota | Função |
|:-----|:-------|
| `Login` | Entrada com e-mail e senha (API Java) |
| `Cadastro` | Criação de conta (API Java) |
| `Sobre` | Sobre o App (versão e commit) |

### Abas protegidas (só autenticado)

| Aba | Função |
|:----|:-------|
| `Inicio` | Resumo do dia e atalhos |
| `MeuPet` | Lista de pets (CRUD) |
| `Checkin` | Novo check-in de humor |
| `Passeio` | Novo registro pós-passeio |
| `Historico` | Linha do tempo da API |
| `Alertas` | Alertas automáticos e lembretes (CRUD), com badge de não lidos |

### Stack protegida (além das abas)

| Rota | Função |
|:-----|:-------|
| `PetForm` | Criar / editar pet |
| `CheckinEditar` | Editar / excluir check-in |
| `PasseioEditar` | Editar / excluir passeio |
| `AlertaForm` | Criar / editar alerta |
| `Orientacao` | Orientação após o check-in |
| `Configuracoes` | Tema (claro/escuro/sistema) e horário do lembrete — **nova** |
| `Sobre` | Sobre o App: versão, hash do commit, distribuição — **nova** |

---

## Arquitetura

```text
app/
├── api/                    # API Java Spring Boot
│   └── src/main/java/br/com/fiap/solin/
│       ├── auth/           # cadastro, login, JWT
│       ├── recurso/        # CRUD + MonitorSaudeService (alertas automáticos)
│       └── distribuicao/   # publicação do APK para testadores
├── src/
│   ├── screens/            # Interface (sem fetch, sem regra de negócio)
│   ├── components/         # UI reutilizável
│   ├── hooks/              # TanStack Query (useQuery/useMutation) e hooks de tela
│   ├── services/           # Acesso HTTP, sessão, notificações, preferências
│   ├── lib/                # Regras puras (validação, rotina, alertas a notificar)
│   ├── contexts/           # Sessão autenticada e tema
│   ├── config/             # URL da API, QueryClient, versão do build
│   ├── navigation/         # Rotas React Navigation
│   ├── types/              # Modelos
│   └── constants/          # Cores (claro/escuro), tema, equipe
├── scripts/distribuir.sh   # publica o APK e convida testadores
└── app.config.js           # grava o hash do commit no build
```

- **Interface:** `screens/` + `components/` — só chamam hooks.
- **Lógica:** `lib/` (funções puras) e `contexts/`.
- **Dados:** `services/` faz o HTTP; `hooks/` envolve os services com TanStack Query (cache, loading, invalidação).

---

## Requisitos acumulados

| Item | Onde |
|:-----|:-----|
| Navegação (≥ 6 telas, React Navigation) | `src/navigation/AppNavigator.tsx` |
| API HTTP + TanStack Query + CRUD | `src/hooks/`, `src/services/` |
| Login real + cadastro + sessão + logout + rotas protegidas | API Java JWT + `AuthContext` + dois stacks |
| Publicação com o professor como testador | módulo `distribuicao` da API |
| Tela Sobre com hash do commit | `SobreScreen` + `app.config.js` |
| Notificações ligadas a eventos reais | `useNotificacoes` + `MonitorSaudeService` |
| Tema claro / escuro | `TemaContext` + `Configuracoes` |
| README | este arquivo |

---

<p align="center">
  <sub>FIAP · 2026 · Equipe Clyvo Vet · 4ª Sprint</sub>
</p>
