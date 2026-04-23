# Sistema de Gestão Acadêmica

Artefato prático de dissertação de mestrado na intersecção entre Engenharia de Software e Inteligência Artificial.

Este repositório documenta um sistema Full-Stack construído inteiramente por meio da orquestração de Agentes de IA especializados. O objetivo não é apenas o software produzido, mas a metodologia empregada: cada linha de código de produção foi escrita em resposta a um teste de aceitação previamente aprovado e formalizado, seguindo rigorosamente o ciclo **Fase RED (especificação falhando) → Fase GREEN (implementação passando)**.

---

## Funcionalidades do Sistema

O sistema implementa um fluxo acadêmico composto por cinco módulos integrados:

1. **Gestão de Alunos** — CRUD completo (criação, consulta, atualização e remoção) de registros de alunos, com validação de CPF (11 dígitos, único), e-mail (formato e unicidade) e nome (mínimo 3 caracteres).
2. **Gestão de Turmas** — CRUD de turmas identificadas por tópico, ano e semestre.
3. **Matrículas** — Associação de alunos a turmas.
4. **Matriz de Avaliações** — Interface matricial (Aluno x Meta) para registro de conceitos. Os conceitos suportados são `MANA` (Meta Ainda Não Atingida), `MPA` (Meta Parcialmente Atingida) e `MA` (Meta Atingida). O sistema rejeita qualquer valor fora desse conjunto.
5. **Notificações em Batch** — Toda alteração de avaliação é enfileirada em `data/notificacoes.json`. A rota `POST /api/notificacoes/processar` agrupa as pendências por aluno e gera um envio consolidado, simulado via `console.log` no processo do servidor.

---

## Arquitetura Orientada a Agentes

Esta é a contribuição central do trabalho. O sistema não foi construído por um desenvolvedor humano escrevendo código diretamente, mas por um **orquestrador humano** que definiu requisitos em linguagem natural e delegou cada fase do desenvolvimento a Agentes de IA com papéis distintos e fronteiras de atuação explícitas.

### A Metodologia OpenSpec

Cada nova funcionalidade seguiu o seguinte protocolo antes de qualquer linha de código ser escrita:

1. O orquestrador redigiu uma instrução estruturada descrevendo o requisito (papel do agente, ação esperada, cenários obrigatórios e restrições).
2. A instrução foi revisada e aprovada como especificação formal.
3. Somente após aprovação o agente correspondente foi ativado.

Esse processo garante rastreabilidade entre requisito e código, e impede que implementações antecipem ou ignorem comportamentos especificados.

### Agentes e Seus Papéis

Os perfis dos agentes são definidos em `.github/agents/` e estabelecem persona, conhecimento do projeto, padrões de código e fronteiras de atuação. Cada agente tem permissão de escrita apenas em seu domínio.

**`.github/agents/test-agent.md` — QA Engineer (Fase RED)**

Responsável exclusivo pela escrita de cenários BDD em Gherkin (português brasileiro) e pela implementação dos *step definitions* em Cucumber.js. Age antes de qualquer código de produção existir. Seu entregável é sempre um conjunto de testes que falha de maneira previsível e documentada, provando que o comportamento ainda não foi implementado.

Fronteiras: escreve apenas em `tests/`. Nunca toca `src/`.

**`.github/agents/backend-agent.md` — Node.js Engineer (Fase GREEN)**

Responsável por fazer os testes do `@test-agent` passarem. Implementa Controllers, Services e Repositories seguindo o padrão arquitetural do projeto, persiste dados via `fs/promises` em arquivos JSON e registra novas rotas em `routes.ts`. Só escreve código de produção quando há um teste falhando que justifica a implementação.

Fronteiras: escreve apenas em `src/backend/`, `src/shared/` e `data/`. Nunca toca `src/frontend/`.

**`.github/agents/frontend-agent.md` — React Engineer (Interface)**

Responsável pela camada de apresentação. Consome a API REST via Axios, constrói componentes React tipados com TypeScript e aplica estilização com Tailwind CSS. Trabalha a partir de contratos de API já estabilizados pelo `@backend-agent`.

Fronteiras: escreve apenas em `src/frontend/`. Nunca toca `src/backend/` nem `tests/`.

### Ciclo de Desenvolvimento por Feature

```
Orquestrador define requisito
        |
        v
@test-agent escreve .feature + steps  -->  npm test  -->  FALHA (Fase RED esperada)
        |
        v
@backend-agent implementa API          -->  npm test  -->  PASSA (Fase GREEN)
        |
        v
@frontend-agent constrói a UI          -->  revisão visual pelo orquestrador
```

---

## Stack Tecnologico

### Backend

| Tecnologia | Versao | Uso |
|---|---|---|
| Node.js | >= 20 | Ambiente de execucao |
| Express | 4.x | Framework HTTP/REST |
| TypeScript | 5.x | Tipagem estatica |
| tsx | 4.x | Execucao direta de `.ts` sem build |
| uuid | 9.x | Geracao de IDs unicos (UUIDv4) |
| fs/promises | nativo | Persistencia em arquivos JSON |

### Frontend

| Tecnologia | Versao | Uso |
|---|---|---|
| React | 18.x | Biblioteca de UI |
| Vite | 8.x | Bundler e servidor de desenvolvimento |
| Tailwind CSS | 3.x | Estilizacao utilitaria |
| Axios | 1.x | Cliente HTTP |

### Qualidade e Testes

| Tecnologia | Versao | Uso |
|---|---|---|
| Cucumber.js | 9.x | Framework BDD (Gherkin) |
| Chai | 4.x | Biblioteca de asercoes |

---

## Como Executar

### Pre-requisitos

- Node.js versao 20 ou superior
- npm versao 9 ou superior

### Instalacao

Na raiz do repositorio, instale todas as dependencias com um unico comando:

```bash
npm install
```

### Executando os Servidores

A aplicacao requer dois processos rodando simultaneamente. Abra dois terminais distintos:

**Terminal 1 — API Backend (porta 3000)**

```bash
npm run dev
```

O servidor iniciara e exibira: `API rodando em http://localhost:3000`

**Terminal 2 — Frontend React (porta 5173)**

```bash
npm run dev:frontend
```

Acesse a aplicacao em `http://localhost:5173` no navegador.

> Os arquivos de persistencia (`data/alunos.json`, `data/turmas.json`, `data/notificacoes.json`) sao gerenciados automaticamente pelo backend. Nao e necessario configuracao de banco de dados.

---

## Como Testar

### Filosofia da Suite de Testes

Os testes nao sao verificacoes posteriores ao desenvolvimento — eles sao o **documento de requisitos executavel**. Cada arquivo `.feature` em `tests/features/` foi escrito pelo `@test-agent` antes da implementacao correspondente existir, e cada cenario foi executado e confirmado como falhando (Fase RED) antes de o `@backend-agent` escrever uma linha de codigo de producao.

A suite cobre integracao real com a API: os *steps* fazem requisicoes HTTP via Axios contra o servidor rodando em `localhost:3000` e validam os corpos de resposta e codigos de status com Chai.

> **Pre-requisito para rodar os testes:** o servidor backend (`npm run dev`) deve estar em execucao.

### Comandos Disponiveis

**Executar todos os cenarios de todas as features:**

```bash
npm test
```

**Alunos — Criacao (11 cenarios)**
Valida regras de negocio para `POST /api/alunos`: campos obrigatorios, formato de CPF, unicidade de CPF e e-mail, tamanho minimo de nome.

```bash
npm run test:creation
```

**Alunos — Consulta (5 cenarios)**
Valida `GET /api/alunos` e `GET /api/alunos/:id`: listagem, busca por ID existente e resposta 404 para IDs inexistentes.

```bash
npm run test:consultation
```

**Alunos — Atualizacao e Remocao (7 cenarios)**
Valida `PUT /api/alunos/:id` e `DELETE /api/alunos/:id`: edicao parcial, unicidade na edicao e remocao com confirmacao de ausencia posterior.

```bash
npm run test:update-delete
```

**Turmas e Avaliacoes (14 cenarios)**
Valida o CRUD completo de `/api/turmas`, a matricula de alunos e o registro de avaliacoes em `/api/turmas/:id/avaliacoes`, incluindo rejeicao de conceitos invalidos.

```bash
npm run test:turmas
```

**Notificacoes em Batch (2 cenarios)**
Valida `POST /api/notificacoes/processar`: consolidacao de multiplas avaliacoes do mesmo aluno em um unico envio, e resposta para fila vazia.

```bash
npm run test:notificacoes
```

### Estado Atual da Suite

```
36 cenarios (36 passando)
171 steps (171 passando)
```

---

## Estrutura do Repositorio

```
/
├── .github/
│   └── agents/                     # Perfis dos Agentes de IA (personas, fronteiras, padroes)
│       ├── backend-agent.md
│       ├── frontend-agent.md
│       └── test-agent.md
│
├── data/                           # Persistencia em arquivo (gerenciada pelo backend)
│   ├── alunos.json
│   ├── turmas.json
│   └── notificacoes.json
│
├── src/
│   ├── backend/
│   │   ├── config/                 # routes.ts — registro central de rotas Express
│   │   ├── controllers/            # Handlers HTTP (AlunoController, TurmaController, NotificacaoController)
│   │   ├── repositories/           # Acesso a dados via fs/promises
│   │   ├── services/               # Logica de negocio e validacoes
│   │   ├── validators/             # Regras de validacao de entrada
│   │   └── server.ts               # Ponto de entrada da API
│   │
│   ├── frontend/
│   │   ├── components/             # Componentes React (ListaAlunos, GerenciarTurmas, formularios)
│   │   ├── services/               # Clientes Axios (alunoService, turmaService, notificacaoService)
│   │   ├── App.tsx                 # Componente raiz com navegacao por abas
│   │   └── main.tsx                # Ponto de entrada React
│   │
│   └── shared/
│       └── types/                  # Interfaces TypeScript compartilhadas entre backend e frontend
│
├── tests/
│   ├── features/                   # Especificacoes BDD em Gherkin (escritas pelo @test-agent)
│   │   ├── alunos-criacao.feature
│   │   ├── alunos-consulta.feature
│   │   ├── alunos-update-delete.feature
│   │   ├── turmas-avaliacoes.feature
│   │   └── notificacoes.feature
│   │
│   ├── helpers/
│   │   └── step-context.ts         # Contexto compartilhado entre step definitions de features distintas
│   │
│   └── steps/                      # Implementacao dos steps Cucumber (Fase RED produzida pelo @test-agent)
│
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

