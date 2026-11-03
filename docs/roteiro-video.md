# Roteiro do vídeo — 4ª Sprint SOLIN

Máximo **5 minutos**, narrado, no YouTube. Mostrar o **APK instalado no celular** (não Expo Go, não Figma).

1. **Abertura (15s)** — Nome do app, problema (rotina do pet) e equipe.
2. **Publicação (50s)** — Abrir o painel `/distribuicao/painel`: versão publicada com o hash do commit e o
   professor cadastrado como testador. Abrir o link de convite no celular, baixar o APK e instalar.
   Dizer que o Firebase App Distribution foi substituído pela distribuição na API Spring Boot, com
   autorização do professor. Voltar ao painel e mostrar o download registrado.
3. **Sobre o App (30s)** — Configurações > Sobre o App: versão e hash do commit. Abrir o mesmo commit no
   GitHub e mostrar que o hash é igual. Mostrar "Você está usando a versão mais recente".
4. **Tema claro/escuro (20s)** — Configurações > Aparência: trocar Claro / Escuro / Igual ao celular.
5. **Notificação de alerta (60s)** — Registrar um passeio com "não urinou". Em até 1 minuto chega a
   notificação "Atenção após o passeio de {pet}". Tocar nela: abre a aba **Alertas** e o alerta fica lido.
6. **Lembrete de check-in (30s)** — Configurações: colocar o lembrete 1–2 minutos à frente, aguardar a
   notificação "Como {pet} está hoje?" e tocar: abre a tela **Check-in**.
7. **Telas anteriores (40s)** — Percorrer Início, Meu Pet (CRUD), Check-in, Passeio, Histórico e Alertas.
8. **Arquitetura (25s)** — Mostrar rapidamente `src/screens`, `src/hooks` (TanStack Query) e `src/services`,
   e a API Java (`MonitorSaudeService` gera os alertas).

Colar o link do YouTube no README, no campo "Vídeo da 4ª Sprint".
