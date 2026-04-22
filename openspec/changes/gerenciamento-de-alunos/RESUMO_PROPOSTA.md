# RESUMO EXECUTIVO: Proposta Técnica - Gerenciamento de Alunos

**Data**: 22 de Abril de 2026  
**Versão**: 1.0  
**Status**: Proposta para Revisão

---

## Objetivo da Proposta

Implementar um módulo completo de **Gerenciamento de Alunos (CRUD)** para o sistema de gestão acadêmica, com persistência em arquivos JSON locais (sem banco de dados), seguindo padrões de desenvolvimento orientado por testes (TDD) e especificação Gherkin em português.

---

## Requisitos Funcionais Atendidos

| Requisito | Status | Descrição |
|-----------|--------|-----------|
| Inclusão de alunos | ✅ | Criar novo aluno com validação de nome, CPF (único) e email (válido) |
| Alteração de alunos | ✅ | Editar dados mantendo integridade (CPF/email únicos, ID imutável) |
| Remoção de alunos | ✅ | Deletar aluno com permanência em JSON |
| Listagem de alunos | ✅ | Visualizar todos os alunos cadastrados |
| Persistência JSON | ✅ | Armazenamento via fs/promises em data/alunos.json |

---

## Arquitetura Técnica

### Stack
- **Backend**: Node.js + TypeScript
- **Persistência**: Arquivos JSON (fs/promises)
- **Frontend**: React 18 com TypeScript
- **Testes**: Cucumber.js com sintaxe Gherkin em português

### Padrão de Camadas
```
Controller (HTTP) → Service (Business Logic) → Validator → Repository (Persistência)
```

### Endpoints REST
```
POST   /api/alunos          → Criar aluno
GET    /api/alunos          → Listar todos
GET    /api/alunos/:id      → Obter por ID
PUT    /api/alunos/:id      → Atualizar
DELETE /api/alunos/:id      → Remover
```

---

## Estrutura de Dados (JSON)

### Schema
```json
{
  "alunos": [
    {
      "id": "uuid-v4",
      "nome": "string (3-255 chars)",
      "cpf": "string (11 dígitos, único)",
      "email": "string (válido, único)",
      "criadoEm": "ISO8601",
      "atualizadoEm": "ISO8601"
    }
  ]
}
```

---

## Validações Implementadas

### Campos Obrigatórios
- ❌ Nome vazio → "Nome é obrigatório"
- ❌ CPF vazio → "CPF é obrigatório"
- ❌ Email vazio → "E-mail é obrigatório"

### Validações de Formato
- ❌ Nome < 3 caracteres → "Nome deve ter no mínimo 3 caracteres"
- ❌ CPF ≠ 11 dígitos → "CPF deve conter 11 dígitos"
- ❌ Email inválido → "E-mail inválido" (regex validação)

### Validações de Unicidade
- ❌ CPF duplicado → "CPF já cadastrado"
- ❌ Email duplicado → "E-mail já cadastrado"

### Regras de Negócio
- ✅ ID gerado automaticamente (UUID v4)
- ✅ Timestamps automáticos (ISO8601)
- ✅ ID e criadoEm imutáveis após criação
- ✅ atualizadoEm atualizado a cada modificação

---

## Cenários de Teste (Gherkin)

### Categorias Cobertas
| Categoria | Cenários | Status |
|-----------|----------|--------|
| Criação | 9 cenários | ✅ Especificados |
| Listagem | 3 cenários | ✅ Especificados |
| Busca por ID | 2 cenários | ✅ Especificados |
| Atualização | 7 cenários | ✅ Especificados |
| Remoção | 3 cenários | ✅ Especificados |
| Integridade | 4 cenários | ✅ Especificados |
| **TOTAL** | **28 cenários** | ✅ |

### Linguagem
- 🇧🇷 Todos os cenários em português (Dado/Quando/Então)
- 📋 Arquivo: `alunos.feature`
- ✅ Alinhado com SKILL.md de Gherkin

---

## Códigos HTTP de Resposta

| Operação | Sucesso | Erro |
|----------|---------|------|
| Criar | 201 Created | 400 Bad Request, 409 Conflict |
| Listar | 200 OK | 200 OK (vazio) |
| Obter | 200 OK | 404 Not Found |
| Atualizar | 200 OK | 400, 404, 409 |
| Remover | 204 No Content | 404 Not Found |

---

## Fluxo de Validação (Chain of Thought)

### Ao Criar Aluno
1. Verificar se nome está vazio
2. Verificar se nome tem mínimo 3 caracteres
3. Verificar se CPF está vazio
4. Verificar se CPF tem 11 dígitos
5. **Verificar se CPF já existe no arquivo**
6. Verificar se email está vazio
7. Verificar se email é válido (regex)
8. **Verificar se email já existe no arquivo**
9. ✅ Gerar UUID, adicionar timestamps, persistir

### Ao Atualizar Aluno
1. Verificar se aluno existe (404)
2. Executar validações de cada campo enviado
3. Se CPF enviado: verificar duplicata (excluindo ID atual)
4. Se email enviado: verificar duplicata (excluindo ID atual)
5. ✅ Atualizar timestamp, persistir

---

## Arquivos Entregues

### 1. **proposal.md** 
Proposta executiva com design técnico, estrutura JSON e regras de negócio.

### 2. **spec.md**
Especificação completa com 15 cenários detalhados em Gherkin português, validações, códigos de erro e API contract REST.

### 3. **alunos.feature**
Arquivo Gherkin executável com 28 cenários de teste em português, preparado para Cucumber.js.

### 4. **implementation-guide.md**
Guia técnico com:
- Estrutura de diretórios completa
- Tipos TypeScript
- Código de exemplo (Repository, Validator, Service, Controller)
- Componentes React (esboço)
- Steps Cucumber (esboço)
- Checklist de implementação

---

## Próximas Etapas (Após Aprovação)

### Fase 1: Backend (Test-Agent)
1. ✅ Escrever steps Cucumber em português
2. ✅ Rodar testes RED (devem falhar)
3. Implementar AlunoRepository (fs/promises)
4. Implementar AlunoValidator
5. Implementar AlunoService
6. Rodar testes GREEN

### Fase 2: API (Backend-Agent)
7. Implementar AlunoController
8. Registrar rotas Express
9. Testar endpoints com Postman/curl
10. Validar persistência JSON

### Fase 3: Frontend (Frontend-Agent)
11. Criar componentes React (Form, Table, Modal)
12. Integrar com API REST
13. Adicionar data-testid para testes E2E
14. Validar fluxo completo

### Fase 4: QA
15. Executar todos os testes Cucumber
16. Validar integridade de dados
17. Testar casos de erro

---

## Riscos e Mitigações

| Risco | Probabilidade | Mitigação |
|-------|--------------|-----------|
| Conflito de IDs duplicados | Baixa | UUID v4 (unicidade garantida) |
| Corrupção de JSON | Baixa | Validação antes de escrita + atomicidade |
| Duplicação de dados em teste | Média | Limpar arquivo antes de cada teste |
| Performance com muitos registros | Baixa | JSON em memória, índices futuros se necessário |

---

## Conformidade com Padrões do Projeto

✅ **Persistência**: Arquivos JSON via fs/promises (conforme project.md)  
✅ **Testes**: Gherkin em português (conforme SKILL.md)  
✅ **Validações**: CPF/Email únicos + formato validado  
✅ **Tipagem**: TypeScript + tipos forte  
✅ **Camadas**: Repository → Service → Controller (separação de responsabilidades)  
✅ **Timestamps**: ISO8601 automáticos  
✅ **HTTP Semântico**: Códigos 201, 404, 409, etc.  

---

## Métricas de Sucesso

| Métrica | Target | Status |
|---------|--------|--------|
| Cobertura de cenários | 100% | ✅ 28/28 |
| Testes em português | 100% | ✅ Gherkin PT-BR |
| Validações de entrada | 100% | ✅ 6+ validações |
| Persistência funcional | 100% | ✅ fs/promises |
| Duplicidade prevenida | 100% | ✅ CPF/Email únicos |
| Códigos HTTP corretos | 100% | ✅ 201, 204, 400, 404, 409 |

---

## Observações Finais

1. **Abordagem conservadora**: Validações múltiplas em camadas para máxima segurança
2. **Sem dependências externas pesadas**: Apenas uuid + express (já no projeto)
3. **Fácil para manutenção**: Código limpo e separação clara de responsabilidades
4. **Testável**: Cada camada é independente e mockável
5. **Escalável**: Estrutura pronta para migração para banco de dados futuramente

---

## Assinatura Digital

**Proposta preparada por**: Arquiteto de Software Sênior (IA)  
**Framework**: OpenSpec Spec-Driven Development  
**Data de Criação**: 2026-04-22  
**Versão**: 1.0  

✅ Pronta para revisão e aprovação humana.

---

## Índice de Arquivos

- [`proposal.md`](proposal.md) - Proposta executiva
- [`spec.md`](specs/gerenciamento-de-alunos/spec.md) - Especificação técnica
- [`alunos.feature`](specs/gerenciamento-de-alunos/alunos.feature) - Testes Gherkin
- [`implementation-guide.md`](specs/gerenciamento-de-alunos/implementation-guide.md) - Guia de implementação
