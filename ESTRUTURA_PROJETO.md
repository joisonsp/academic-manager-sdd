# 📁 ESTRUTURA DO PROJETO - Gerenciamento de Alunos (TDD - Fase RED)

```
Segundo_Experimento/
│
├── 📄 package.json                          ✅ Dependências (Cucumber, Express, TypeScript)
├── 📄 tsconfig.json                         ✅ Configuração TypeScript
├── 📄 cucumber.js                           ✅ Configuração Cucumber.js com perfis
├── 📄 .env.example                          ✅ Variáveis de ambiente
│
├── 📄 SUMARIO_TESTES.md                     ✅ Sumário executivo desta implementação
├── 📄 BACKEND-IMPLEMENTATION-GUIDE.md       ✅ Guia para backend-agent
│
├── 🔷 openspec/                             📊 Especificações OpenSpec
│   ├── config.yaml
│   ├── project.md
│   └── changes/
│       └── gerenciamento-de-alunos/
│           ├── proposal.md                  ✅ Proposta técnica
│           ├── RESUMO_PROPOSTA.md          ✅ Resumo executivo
│           ├── INDEX.md                    ✅ Índice de navegação
│           ├── SUMARIO_ENTREGA.md          ✅ Sumário de entrega
│           └── specs/gerenciamento-de-alunos/
│               ├── spec.md                 ✅ Especificação com 15 cenários
│               ├── alunos.feature          ✅ Arquivo original com 28 cenários
│               └── implementation-guide.md ✅ Guia técnico
│
├── 🔷 src/                                   💻 Código Fonte
│   ├── backend/
│   │   ├── controllers/                    ⏳ Por implementar
│   │   ├── services/                       ⏳ Por implementar
│   │   ├── validators/                     ⏳ Por implementar
│   │   ├── repositories/                   ⏳ Por implementar
│   │   ├── config/
│   │   │   └── routes.ts                   ⏳ Por implementar
│   │   └── server.ts                       ⏳ Por implementar
│   └── shared/
│       └── types/
│           └── aluno.types.ts              ✅ Interfaces TypeScript
│
├── 🔷 tests/                                 🧪 Testes Cucumber.js
│   ├── 📄 README.md                        ✅ Como rodar os testes
│   ├── 📄 API-CONTRACT.md                  ✅ Contrato esperado da API
│   ├── features/
│   │   └── alunos-criacao.feature          ✅ 9 cenários Gherkin (CRIAÇÃO)
│   ├── steps/
│   │   └── criacao-alunos.steps.ts         ✅ 30+ steps em TypeScript
│   └── helpers/
│       └── http-client.ts                  ✅ Cliente HTTP mock
│
├── 🔷 data/                                  💾 Persistência JSON
│   └── alunos.json                         ⏳ Criado automaticamente
│
├── .github/                                  🛠️ Configuração do Projeto
│   ├── skills/
│   │   └── gherkin-testing/
│   │       └── SKILL.md
│   └── agents/
│       ├── test-agent.md
│       ├── backend-agent.md
│       └── frontend-agent.md
│
└── 📄 .gitignore                            📋 Arquivos ignorados

```

---

## 📊 Status por Componente

### ✅ COMPLETO: Testes (Test-Agent)
```
✅ Configuração Cucumber.js
✅ 9 cenários em Gherkin português
✅ 30+ step definitions em TypeScript
✅ Hooks (Before/After)
✅ Cliente HTTP mock
✅ Documentação completa
✅ FASE RED: Testes falham com 503 (API não existe)
```

### ⏳ PENDENTE: Backend (Backend-Agent)
```
⏳ Express Server
⏳ Controller para POST /api/alunos
⏳ Service com lógica de negócio
⏳ Validator com 8 validações
⏳ Repository para persistência JSON
⏳ FASE GREEN: Testes devem passar
```

### ⏳ PENDENTE: Frontend (Frontend-Agent)
```
⏳ Página React para listar alunos
⏳ Formulário para criar aluno
⏳ Modal de confirmação
⏳ Integração com API REST
```

---

## 🧪 Cenários de Teste Prontos (9)

### 📍 Localização
`tests/features/alunos-criacao.feature`

### 📋 Conteúdo
```
✅ 1 cenário de sucesso
   └─ Criar aluno com dados válidos → 201 Created

✅ 3 cenários de validação CPF
   ├─ CPF vazio → 400
   ├─ CPF 10 dígitos → 400
   └─ CPF duplicado → 409

✅ 3 cenários de validação Email
   ├─ Email vazio → 400
   ├─ Email inválido → 400
   └─ Email duplicado → 409

✅ 2 cenários de validação Nome
   ├─ Nome vazio → 400
   └─ Nome < 3 chars → 400

✅ 1 cenário com múltiplos erros
   └─ Múltiplos campos inválidos → 400 (primeiro erro)
```

---

## 🚀 Como Usar

### 1️⃣ Ver Status Atual (FASE RED)

```bash
cd Segundo_Experimento
npm install
npm run test:creation
```

**Saída esperada**: ❌ 9 cenários falham com 503 (API não existe)

### 2️⃣ Implementar Backend (Backend-Agent)

Seguir: `BACKEND-IMPLEMENTATION-GUIDE.md`

```bash
# Implementar:
# - Repository (CRUD JSON)
# - Validator (8 validações)
# - Service (orquestração)
# - Controller (HTTP handler)
# - Routes (POST /api/alunos)
# - Server (Express na porta 3000)
```

### 3️⃣ Rodar Testes com API (FASE GREEN)

```bash
# Terminal 1
npm run dev              # Inicia API em localhost:3000

# Terminal 2 (novo terminal)
npm run test:creation   # Testa API

# Esperado: ✅ 9 cenários passando
```

---

## 📚 Documentação Disponível

| Documento | Localização | Propósito |
|-----------|------------|----------|
| Proposta Técnica | `openspec/changes/gerenciamento-de-alunos/proposal.md` | Design da solução |
| Especificação | `openspec/changes/gerenciamento-de-alunos/specs/spec.md` | 15 cenários detalhados |
| Testes Gherkin | `tests/features/alunos-criacao.feature` | 9 cenários em português |
| API Contract | `tests/API-CONTRACT.md` | Contrato HTTP esperado |
| Como Rodar | `tests/README.md` | Instruções de testes |
| Implementação | `BACKEND-IMPLEMENTATION-GUIDE.md` | Guia para backend-agent |
| Tipos | `src/shared/types/aluno.types.ts` | Interfaces TypeScript |

---

## 🔄 Próximas Fases (após backend implementado)

### Fase 2: Testes de LISTAGEM (3 cenários)
```
- Listar alunos vazio
- Listar 1 aluno
- Listar múltiplos alunos
```

### Fase 3: Testes de BUSCA (2 cenários)
```
- Buscar aluno existente
- Buscar aluno inexistente → 404
```

### Fase 4: Testes de ATUALIZAÇÃO (8 cenários)
```
- Atualizar nome com sucesso
- Atualizar email com sucesso
- Rejeitar CPF duplicado → 409
- Rejeitar email duplicado → 409
- ... (4 cenários adicionais)
```

### Fase 5: Testes de REMOÇÃO (3 cenários)
```
- Remover aluno com sucesso
- Remover entre múltiplos
- Rejeitar remoção de inexistente → 404
```

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| Cenários de CRIAÇÃO | 9 ✅ |
| Steps implementados | 30+ ✅ |
| Arquivos criados | 15+ ✅ |
| Linhas de código | ~2000 ✅ |
| Cobertura: CRIAÇÃO | 100% ✅ |
| Cobertura: LISTAGEM | 0% ⏳ |
| Cobertura: BUSCA | 0% ⏳ |
| Cobertura: ATUALIZAÇÃO | 0% ⏳ |
| Cobertura: REMOÇÃO | 0% ⏳ |
| Status Geral | 🔴 RED (esperado) |

---

## 🛠️ Stack Tecnológico

```
Frontend
├─ React 18 (próximo: @frontend-agent)
├─ TypeScript
└─ Axios ou Fetch

Backend
├─ Express.js
├─ TypeScript
├─ UUID
└─ fs/promises

Testes
├─ Cucumber.js
├─ Gherkin (português)
├─ TypeScript
├─ Chai (assertions)
└─ Fetch API

Banco de Dados
└─ JSON (data/alunos.json)
```

---

## ✅ Conformidade com Padrões

| Padrão | Status |
|--------|--------|
| Gherkin em Português | ✅ 100% |
| SKILL gherkin-testing | ✅ Seguido |
| TDD (Red-Green-Refactor) | ✅ Fase RED completa |
| Separação de Responsabilidades | ✅ Implementado |
| Tipagem TypeScript | ✅ Forte |
| Documentação | ✅ Completa |
| Tags Cucumber | ✅ Implementadas |

---

## 🎓 Aprendizados por Fase

### 🔴 FASE RED (Atual)
- [x] Entender os requisitos
- [x] Escrever testes
- [x] Configurar Cucumber
- [x] Validar que testes falham corretamente

### 🟢 FASE GREEN (Próxima)
- [ ] Implementar o mínimo necessário
- [ ] Fazer testes passarem
- [ ] Validar comportamento correto

### 🔵 FASE REFACTOR (Depois)
- [ ] Melhorar código
- [ ] Otimizar performance
- [ ] Adicionar mais testes

---

## 📞 Responsáveis

| Fase | Responsável | Status |
|------|------------|--------|
| RED (Testes) | @test-agent | ✅ Completo |
| GREEN (Backend) | @backend-agent | ⏳ Pendente |
| REFACTOR (Frontend) | @frontend-agent | ⏳ Pendente |

---

## 🚨 Importante

**A API DEVE retornar 503 nesta fase**

Isto prova que:
- ✅ Os testes estão corretos
- ✅ A API não foi implementada
- ✅ Pronto para backend-agent

Quando implementada, os testes passarão!

---

## 📎 Quick Links

- Rodar testes: `npm run test:creation`
- Implementação: Ler `BACKEND-IMPLEMENTATION-GUIDE.md`
- Especificação: Ver `openspec/changes/gerenciamento-de-alunos/`
- Código de exemplo: Ver `tests/steps/criacao-alunos.steps.ts`

---

**Criado por**: @test-agent (QA Engineer Sênior)  
**Framework**: OpenSpec + Cucumber.js  
**Data**: 2026-04-22  
**Status**: 🔴 FASE RED - Pronto para implementação backend
