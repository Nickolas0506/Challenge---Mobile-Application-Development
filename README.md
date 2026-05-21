# SOLIN — App Mobile

<p align="center">
  <strong>Challenge FIAP 2026 · Clyvo Vet</strong><br/>
  <em>O cuidado que protege o seu pet</em>
</p>

---

## Sobre o projeto

O **SOLIN** é um protótipo mobile para tutores de pets, desenvolvido no contexto do desafio **Clyvo Vet**. O foco é criar **hábito de uso diário**: check-in rápido, orientação imediata (sem diagnóstico médico) e registro de rotina que pode alimentar o prontuário veterinário.

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

## Repositório

**GitHub:** [Challenge - Mobile Application Development](https://github.com/Nickolas0506/Challenge---Mobile-Application-Development)

```text
https://github.com/Nickolas0506/Challenge---Mobile-Application-Development.git
```

---

## Funcionalidades

| Recurso | Descrição |
|:--------|:----------|
| Check-in diário | Registro em 1 toque com humor e observação |
| Orientação | Resposta imediata após o check-in |
| Passeio | Formulário pós-passeio (água, urina, fezes, comportamento) |
| Meu pet | Cadastro e edição com foto opcional |
| Histórico | Check-ins, passeios e eventos do sensor IoT |
| Alertas | Lembretes de rotina, vacina e sensor urinário |

---

## Tecnologias

| Categoria | Ferramenta |
|:----------|:-----------|
| Framework | React Native + Expo (SDK 54) |
| Navegação | React Navigation (Stack + Bottom Tabs) — sem Expo Router |
| Armazenamento | AsyncStorage |
| Linguagem | TypeScript |

---

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- App **Expo Go** no celular (ou emulador Android)

### Passos

```bash
cd solin-mobile
npm install
npm start
```

Escaneie o **QR code** que aparece no terminal com o **Expo Go** (Android) ou com a **Câmera** do iPhone.

> **Importante:** use celular ou emulador. O app não roda no navegador (Expo Web) — a tela exibe aviso para abrir no Expo Go, conforme exigência do sprint.

**Primeiro login:** se ainda não houver pet salvo, o fluxo abre a rota `CadastroPet`; depois de salvar, segue para as abas.

---

## Navegação

O app possui **mais de 5 rotas** navegáveis, com **React Navigation**.

### Stack (pilha)

| Rota | Descrição |
|:-----|:----------|
| `Login` | Entrada do tutor (formulário com validação) |
| `CadastroPet` | Primeiro acesso sem pet — cadastro obrigatório antes das abas |
| `Orientacao` | Orientação após o check-in |
| `MainTabs` | Abas principais (após login com pet já cadastrado) |

### Bottom Tabs (abas)

| Aba | Descrição |
|:----|:----------|
| `Inicio` | Dashboard e resumo do dia |
| `MeuPet` | Dados e foto do pet |
| `Checkin` | Check-in em 1 toque |
| `Passeio` | Registro pós-passeio |
| `Historico` | Linha do tempo unificada |
| `Alertas` | Lembretes e notificações |

> Arquivo principal: `navigation/AppNavigator.tsx`

---

## Persistência de dados

Dados salvos com **AsyncStorage** e restaurados ao reabrir o app:

- Tutor logado
- Pet cadastrado
- Check-ins e streak
- Passeios
- Eventos do sensor IoT
- Alertas

> Implementação: `lib/storage.ts`

---

## Estrutura do projeto

```text
solin-mobile/
├── assets/
├── components/
├── constants/
├── lib/
├── navigation/
├── screens/
├── App.tsx
├── app.json
└── index.ts
```

---

<p align="center">
  <sub>FIAP · 2026 · Equipe Clyvo Vet</sub>
</p>
