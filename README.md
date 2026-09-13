# SOLIN — App Mobile

<p align="center">
  <strong>Challenge FIAP 2026 · Clyvo Vet</strong><br/>
  <em>O cuidado que protege o seu pet · 3ª Sprint</em>
</p>

---

## Problema

Tutores de pets costumam perceber mudanças na rotina (apetite, urina, comportamento) tarde demais. Falta um hábito simples de registro diário que alimente o acompanhamento — inclusive com dados de sensor IoT na caixa de areia.

## Solução

O **SOLIN** é o aplicativo do tutor: check-in em poucos toques, registro pós-passeio, cadastro do pet, alertas e histórico. Nesta 3ª sprint o protótipo visual virou **base funcional**: autenticação real na API Java Spring Boot, HTTP com CRUD e dados que atualizam sozinhos na interface.

---

## Equipe

| Nome | RM |
|:-----|:---|
| Nickolas Davi | 564105 |
| Samara Vilela | 566133 |
| Natália Cristina | 564099 |
| Otávio Ferreira | 565960 |
| Rodrigo Carvalho | 565162 |

**GitHub:** [Challenge - Mobile Application Development](https://github.com/Nickolas0506/Challenge---Mobile-Application-Development)

**Vídeo da 3ª sprint (YouTube, até 5 min):** [https://youtu.be/vLmsxIUhOj8](https://youtu.be/vLmsxIUhOj8)

---

## Tecnologias

| Categoria | Ferramenta |
|:----------|:-----------|
| App | React Native + Expo SDK 57 + TypeScript |
| Navegação | React Navigation (Stack + Bottom Tabs) |
| Dados HTTP | TanStack Query (`useQuery` / `useMutation`) |
| API backend | Java 21 + Spring Boot 3 (REST: GET, POST, PUT, DELETE) |
| Autenticação | API Java (cadastro/login + JWT) |
| Persistência de sessão | JWT + AsyncStorage |

---

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [JDK 21+](https://adoptium.net/) e [Maven 3.9+](https://maven.apache.org/)
- App **Expo Go** no celular (mesma Wi-Fi do PC) **ou** emulador

### 1. Instalar

```bash
cd app
npm install
```

Se o repositório já estiver na pasta do projeto:

```bash
npm install
```

### 2. Subir API + app

Em um terminal:

```bash
npm run dev
```

Isso sobe a **API Java** em `http://localhost:8080` e o **Expo**.

Ou em dois terminais:

```bash
npm run api
npm start
```

### 3. Abrir no celular ou emulador

- Escaneie o QR com o **Expo Go** (mesma rede Wi-Fi).
- A API é descoberta pelo IP da LAN automaticamente.
- Se precisar forçar o endereço: `EXPO_PUBLIC_API_URL=http://SEU_IP:8080`

> A avaliação pede o app **rodando no smartphone ou emulador**, não só protótipo de Figma.

**Primeiro uso:** crie uma conta na tela **Cadastro**, depois faça login. A sessão permanece ao reabrir o app. Use **Sair** no Início para encerrar.

---

## Telas (React Navigation)

Rotas declaradas em `navigation/AppNavigator.tsx`. Sem Expo Router. Sem troca de tela por `if`/`useState`.

### Stack pública (só deslogado)

| Rota | Função |
|:-----|:-------|
| `Login` | Entrada com e-mail e senha (API Java) |
| `Cadastro` | Criação de conta (API Java) |

### Abas protegidas (só autenticado)

| Aba | Função |
|:----|:-------|
| `Inicio` | Resumo do dia e atalhos |
| `MeuPet` | Lista de pets (CRUD) |
| `Checkin` | Novo check-in de humor |
| `Passeio` | Novo registro pós-passeio |
| `Historico` | Linha do tempo da API |
| `Alertas` | Lembretes (CRUD) |

### Stack protegida (além das abas)

| Rota | Função |
|:-----|:-------|
| `PetForm` | Criar / editar pet |
| `CheckinEditar` | Editar / excluir check-in |
| `PasseioEditar` | Editar / excluir passeio |
| `AlertaForm` | Criar / editar alerta |
| `Orientacao` | Orientação após o check-in |

Telas internas **não abrem** sem login: o navigator autenticado só existe depois da API confirmar o token JWT.

---

## Integração com a API (TanStack Query)

Os dados da interface **vêm só da API**. Não há mock, arquivo local nem valor fixo no lugar da resposta.

Duas funcionalidades principais com **CRUD completo na UI**:

| Recurso | Create | Read | Update | Delete |
|:--------|:------:|:----:|:------:|:------:|
| **Pets** | `PetForm` | `MeuPet` / `Inicio` | `PetForm` | `MeuPet` |
| **Check-ins** | `Checkin` | `Historico` / `Inicio` | `CheckinEditar` | `CheckinEditar` |

Também na API (CRUD na interface): **passeios** e **alertas**. Eventos do sensor PIR são gravados em `eventosIot`.

Durante as requisições a UI mostra **loading**. Depois de criar/editar/excluir, o TanStack Query **invalida o cache** e a lista atualiza sozinha — sem reiniciar o app e sem `useState` manual da lista.

Chamadas HTTP ficam em `services/`. Telas só usam hooks em `hooks/`.

---

## Arquitetura

```text
solin-mobile/
├── api/                 # API Java Spring Boot (auth + CRUD)
├── screens/             # Interface (sem fetch)
├── components/          # UI reutilizável
├── hooks/               # TanStack Query
├── services/            # Acesso HTTP e autenticação
├── contexts/            # Sessão autenticada
├── config/              # API URL e QueryClient
├── navigation/          # Rotas React Navigation
├── types/               # Modelos
├── lib/                 # Validação e orientação (regra de tela)
└── constants/           # Tema e espécies
```

- **Interface:** `screens/` + `components/`
- **Regras / sessão:** `contexts/`, `lib/`
- **Dados / HTTP:** `services/` + `hooks/`

---

## Requisitos da 3ª sprint

| Item | Onde |
|:-----|:-----|
| Navegação (≥ 6 telas, React Navigation) | `navigation/AppNavigator.tsx` |
| API HTTP + TanStack Query + CRUD | `hooks/`, `services/`, telas de pet e check-in |
| Login real + cadastro + sessão + logout + rotas protegidas | API Java JWT + `AuthContext` + dois stacks |
| Arquitetura em camadas | pastas `screens`, `services`, `hooks`, `components` |
| README | este arquivo |

---

<p align="center">
  <sub>FIAP · 2026 · Equipe Clyvo Vet · 3ª Sprint</sub>
</p>
