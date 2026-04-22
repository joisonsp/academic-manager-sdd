# 🧪 Testes Automatizados - Gerenciamento de Alunos

## Visão Geral

Este diretório contém os testes de aceitação em BDD (Behavior Driven Development) usando Cucumber e Gherkin para a funcionalidade de **Criação de Alunos**.

**Status Atual**: 🔴 **FASE RED do TDD** - Os testes estão prontos, mas a API não foi implementada ainda (esperado falhar com 503 - Serviço Indisponível).

---

## 📋 Estrutura

```
tests/
├── features/
│   └── alunos-criacao.feature    (9 cenários em português)
├── steps/
│   └── criacao-alunos.steps.ts   (Step definitions em TypeScript)
└── helpers/
    └── http-client.ts           (Cliente HTTP para requisições)
```

---

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Rodar Testes de Criação (APENAS cenários de CRIAÇÃO)

```bash
npm run test:creation
```

### Saída Esperada (Fase RED)

```
❌ 9 cenários
❌ 1 sucesso (esperado falhar com 503)
❌ 8 falhas em validação (esperado falhar com 503)

ERRO: API não respondeu (503)
```

### 3. Rodar Todos os Testes (quando implementados)

```bash
npm test
```

---

## 📝 Cenários Implementados (9 total)

### ✅ Sucesso (1)
- [x] **Criar aluno com dados válidos completos**
  - Entrada: nome, CPF (11 dígitos), email válido
  - Esperado: 201 Created + ID gerado + timestamps iguais

### ❌ Validação de CPF (3)
- [ ] **Rejeitar criação com CPF vazio**
  - Entrada: CPF vazio
  - Esperado: 400 Bad Request + "CPF é obrigatório"

- [ ] **Rejeitar criação com CPF de 10 dígitos**
  - Entrada: CPF com apenas 10 dígitos
  - Esperado: 400 Bad Request + "CPF deve conter 11 dígitos"

- [ ] **Rejeitar criação com CPF duplicado**
  - Entrada: CPF já cadastrado
  - Esperado: 409 Conflict + "CPF já cadastrado"

### ❌ Validação de Email (3)
- [ ] **Rejeitar criação com e-mail vazio**
  - Entrada: Email vazio
  - Esperado: 400 Bad Request + "E-mail é obrigatório"

- [ ] **Rejeitar criação com e-mail em formato inválido**
  - Entrada: Email sem @ ou domínio
  - Esperado: 400 Bad Request + "E-mail inválido"

- [ ] **Rejeitar criação com e-mail duplicado**
  - Entrada: Email já cadastrado
  - Esperado: 409 Conflict + "E-mail já cadastrado"

### ❌ Validação de Nome (2)
- [ ] **Rejeitar criação com nome vazio**
  - Entrada: Nome vazio
  - Esperado: 400 Bad Request + "Nome é obrigatório"

- [ ] **Rejeitar criação com nome muito curto**
  - Entrada: Nome com menos de 3 caracteres
  - Esperado: 400 Bad Request + "Nome deve ter no mínimo 3 caracteres"

### ❌ Múltiplos Campos (1)
- [ ] **Rejeitar criação com múltiplos campos inválidos**
  - Entrada: Vários campos inválidos
  - Esperado: 400 Bad Request + erro do primeiro campo obrigatório

---

## 🔄 Ciclo TDD

### 🔴 RED (Atual)
```
Tests escritos ✅
API não existe ❌
Tests falham com 503 ✅ (Esperado)
```

### 🟢 GREEN (Próximo)
```
Implementar backend (REST API)
Implementar validações
Tests passam ✅
```

### 🔵 REFACTOR (Depois)
```
Otimizar código
Adicionar mais testes
Melhorar performance
```

---

## 📊 Relatórios

Após executar os testes, relatórios HTML são gerados:

```
cucumber-report-criacao.html   (Relatório visual dos testes)
cucumber-report-criacao.json   (Dados brutos para CI/CD)
```

---

## 💡 Próximas Etapas

1. **Backend Agent** implementará:
   - REST API em Express (PORT 3000)
   - Controllers, Services, Validators
   - Persistência em JSON (data/alunos.json)

2. **Quando API estiver pronta**:
   ```bash
   # API iniciará em http://localhost:3000
   npm run dev
   
   # Em outro terminal, rodar testes
   npm run test:creation
   ```

3. **Testes devem passar** (Fase GREEN)
   - 1 cenário com sucesso ✅
   - 8 cenários com falha esperada ✅

---

## 🛠️ Tecnologias Usadas

- **Cucumber.js**: Framework BDD
- **Gherkin**: Sintaxe de testes em português
- **TypeScript**: Step definitions
- **Chai**: Assertions
- **Node.js**: Runtime
- **Fetch API**: Cliente HTTP

---

## 📌 Tags Disponíveis

Use tags para executar subconjuntos de testes:

```bash
# Apenas cenários de sucesso
npm run test -- --tags "@sucesso"

# Apenas validações de CPF
npm run test -- --tags "@validacao-cpf"

# Apenas validações de Email
npm run test -- --tags "@validacao-email"

# Apenas validações de Nome
npm run test -- --tags "@validacao-nome"

# Múltiplos campos
npm run test -- --tags "@validacao-multiplos"
```

---

## 🐛 Troubleshooting

### "Cannot find module 'ts-node/esm'"
```bash
npm install --save-dev ts-node
```

### "Serviço indisponível (503)"
Isso é **ESPERADO** na fase RED! Significa que:
- ✅ Os testes estão corretos
- ✅ A API ainda não foi implementada
- ⏳ Aguardando implementação do backend

### "Port 3000 já em uso"
```bash
# Encontrar processo usando a porta
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Matar processo
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Mac/Linux
```

---

## 📖 Recursos

- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)
- [BDD Best Practices](https://cucumber.io/docs/bdd/)

---

## 👨‍💻 Autor

Testes desenvolvidos por: **@test-agent** (QA Engineer Sênior)  
Framework: **OpenSpec + Cucumber.js**  
Data: **2026-04-22**

---

## ✅ Checklist de Implementação

- [x] Step definitions para CRIAÇÃO criados
- [x] 9 cenários de teste em português
- [x] Cliente HTTP mock
- [x] Estrutura de diretórios
- [ ] Backend implementado (próximo: @backend-agent)
- [ ] Testes passando (próximo: após backend)
- [ ] Testes de LISTAGEM (próximo)
- [ ] Testes de ATUALIZAÇÃO (próximo)
- [ ] Testes de REMOÇÃO (próximo)

---

**Status**: 🔴 FASE RED - Pronto para implementação do backend
