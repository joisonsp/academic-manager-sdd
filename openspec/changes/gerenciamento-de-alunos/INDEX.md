# 📋 ÍNDICE - Proposta Técnica: Gerenciamento de Alunos

## 📑 Documentos Entregues

```
openspec/changes/gerenciamento-de-alunos/
│
├── proposal.md                               (Proposta com design técnico)
├── RESUMO_PROPOSTA.md                       (Resumo executivo - LEIA PRIMEIRO!)
│
└── specs/gerenciamento-de-alunos/
    ├── spec.md                              (Especificação com 15 cenários)
    ├── alunos.feature                       (28 cenários Gherkin executáveis)
    └── implementation-guide.md              (Guia técnico com código TypeScript)
```

---

## 🎯 Visão Rápida

### Requisito
✅ **Gerenciamento (inclusão, alteração e remoção) de alunos** com lista, contendo nome, CPF e email.

### Solução
- 📦 **CRUD REST** em 5 endpoints
- 🔍 **Validações robustas**: CPF único, email válido, campos obrigatórios
- 💾 **Persistência**: Arquivo JSON (data/alunos.json) via fs/promises
- 🧪 **28 cenários Gherkin** em português (Dado/Quando/Então)
- 🏗️ **Arquitetura em camadas**: Controller → Service → Validator → Repository

---

## 📚 Guia de Leitura Recomendado

### Para Compreender Rapidamente
1. **Leia**: [RESUMO_PROPOSTA.md](RESUMO_PROPOSTA.md) (5 min)
   - Visão executiva, métricas, riscos, próximas etapas

### Para Detalhes de Design
2. **Leia**: [proposal.md](proposal.md) (10 min)
   - Why? What? Technical Design, Capabilities, Impact
   - Estrutura JSON, validações, regras de negócio

### Para Especificação Completa
3. **Leia**: [specs/gerenciamento-de-alunos/spec.md](specs/gerenciamento-de-alunos/spec.md) (15 min)
   - 15 cenários Gherkin em português detalhados
   - Tabela de erros HTTP, API contract REST
   - Regras de validação por camada

### Para Implementação
4. **Leia**: [specs/gerenciamento-de-alunos/implementation-guide.md](specs/gerenciamento-de-alunos/implementation-guide.md) (30 min)
   - Estrutura de diretórios completa
   - Código TypeScript de exemplo (Repository, Validator, Service, Controller)
   - Implementação React (esboço)
   - Checklist de 11 passos

### Para Testes Executáveis
5. **Execute**: [specs/gerenciamento-de-alunos/alunos.feature](specs/gerenciamento-de-alunos/alunos.feature)
   - 28 cenários Gherkin em português
   - Pronto para Cucumber.js
   - Cobrindo: Criação, Listagem, Busca, Atualização, Remoção, Integridade

---

## 🔑 Pontos-Chave da Proposta

### ✅ Validações Implementadas (6 regras)
- Nome obrigatório e mínimo 3 caracteres
- CPF obrigatório com exatamente 11 dígitos
- CPF único no sistema
- Email obrigatório e formato válido
- Email único no sistema
- Todos os campos validados em múltiplas camadas

### ✅ Estrutura de Dados (Campo Auditor)
```json
{
  "id": "uuid-v4",           // Imutável, gerado automaticamente
  "nome": "string",          // 3-255 caracteres
  "cpf": "11 dígitos",       // Único
  "email": "válido",         // Único
  "criadoEm": "ISO8601",     // Imutável
  "atualizadoEm": "ISO8601"  // Atualizado
}
```

### ✅ Endpoints REST (5 operações)
```http
POST   /api/alunos          → 201 Created
GET    /api/alunos          → 200 OK (lista)
GET    /api/alunos/:id      → 200 OK (um) ou 404 Not Found
PUT    /api/alunos/:id      → 200 OK ou 400/404/409
DELETE /api/alunos/:id      → 204 No Content ou 404
```

### ✅ Cenários de Teste (28 total)
- 9 de Criação (sucesso + 5 falhas)
- 3 de Listagem
- 2 de Busca
- 7 de Atualização (sucesso + 4 falhas)
- 3 de Remoção
- 4 de Integridade

### ✅ Códigos de Erro HTTP
```
400 Bad Request    → Validação falhou (vazio, formato, mínimo)
404 Not Found      → Aluno não existe
409 Conflict       → CPF/Email já cadastrado
500 Server Error   → Erro de I/O em fs
```

---

## 📊 Arquitetura Visual

```
┌─────────────────────────────────────────────────────┐
│                  Frontend React                      │
│  (AlunoForm, AlunoTable, AlunoModal)               │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP REST
┌──────────────────▼──────────────────────────────────┐
│           Controller (HTTP Handler)                  │
│  (POST/GET/PUT/DELETE → 201/200/204/400/404/409)  │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│         Service (Business Logic)                     │
│  (Orquestra Validator + Repository)                │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────────┐  ┌────▼──────────────┐
│ Validator          │  │ Repository        │
│ - Obrigatoriedade  │  │ - CRUD JSON       │
│ - Formato (regex)  │  │ - Atomicidade     │
│ - Unicidade (bd)   │  │ - fs/promises     │
└────────────────────┘  └────┬──────────────┘
                             │
                    ┌────────▼─────────┐
                    │ data/alunos.json │
                    │  (Persistência)  │
                    └──────────────────┘
```

---

## 🧪 Exemplos de Cenários

### ✅ Sucesso: Criar Aluno Válido
```gherkin
Cenário: Criar aluno com dados válidos completos
  Quando eu submeto um novo aluno com:
    | campo | valor              |
    | nome  | João Silva         |
    | cpf   | 12345678901        |
    | email | joao@example.com   |
  Então o aluno deve ser criado com sucesso
  E o sistema deve retornar um ID gerado automaticamente
```

### ❌ Falha: CPF Duplicado
```gherkin
Cenário: Rejeitar criação com CPF duplicado
  Dado que um aluno com CPF "12345678901" já existe
  Quando eu submeto um novo aluno com CPF "12345678901"
  Então a operação deve falhar com código 409
  E a mensagem de erro deve conter "CPF já cadastrado"
```

### ❌ Falha: Email Inválido
```gherkin
Cenário: Rejeitar criação com e-mail em formato inválido
  Quando eu submeto um novo aluno com email "email-invalido"
  Então a operação deve falhar com código 400
  E a mensagem de erro deve conter "E-mail inválido"
```

---

## 📋 Checklist de Revisão

- [ ] Requisitos funcionais cobertos (CRUD + validações)
- [ ] Estrutura JSON apropriada (com UUIDs e timestamps)
- [ ] Cenários Gherkin em português (28 cenários)
- [ ] Validações bem mapeadas (6 regras principais)
- [ ] Códigos HTTP semânticos (201, 204, 400, 404, 409)
- [ ] Arquitetura em camadas (Controller → Service → Validator → Repository)
- [ ] Persistência via fs/promises (sem banco de dados)
- [ ] Guia de implementação completo (com código TypeScript)
- [ ] Próximas etapas claras (Fases 1-4)

---

## 🚀 Como Proceder

### Se Aprovada a Proposta:
1. ✅ Revisar documentos (15-30 min)
2. ✅ Aprovar ou pedir ajustes
3. 🔄 Executar `/opsx-apply`
4. 📝 Invocar `@test-agent` para escrever steps Cucumber
5. 🔨 Invocar `@backend-agent` para implementar código
6. 🎨 Invocar `@frontend-agent` para criar UI React
7. ✅ Executar testes e validar

### Se Solicitar Ajustes:
- Indicar qual seção precisa ajuste
- Fornecer feedback específico
- Retocar proposta conforme necessário

---

## 📞 Informações de Contato

**Proposta preparada por**: Arquiteto de Software Sênior (GitHub Copilot)  
**Utilizando**: Framework OpenSpec + Skill: gherkin-testing  
**Data**: 22 de Abril de 2026  
**Versão**: 1.0 Pronta para Revisão  

✅ **STATUS**: Aguardando revisão e aprovação para prosseguir à fase de implementação.

---

## 📎 Referências Rápidas

| Conceito | Localização |
|----------|-------------|
| Endpoints REST | [spec.md](specs/gerenciamento-de-alunos/spec.md#endpoints-rest) |
| Validações | [spec.md](specs/gerenciamento-de-alunos/spec.md#validações-de-entrada) |
| Código TypeScript | [implementation-guide.md](specs/gerenciamento-de-alunos/implementation-guide.md) |
| Cenários Gherkin | [alunos.feature](specs/gerenciamento-de-alunos/alunos.feature) |
| Métricas de Sucesso | [RESUMO_PROPOSTA.md](RESUMO_PROPOSTA.md#métricas-de-sucesso) |
| Próximas Etapas | [RESUMO_PROPOSTA.md](RESUMO_PROPOSTA.md#próximas-etapas-após-aprovação) |
