## Why

O gerenciamento centralizado de alunos é a base fundamental de um sistema de avaliação educacional. Sem esse módulo, não há como manter o cadastro consistente de estudantes com suas informações essenciais (nome, CPF, e-mail), impossibilitando tanto o registro de avaliações quanto o envio de notificações personalizadas.

## What Changes

### Nova Funcionalidade: Módulo de Gerenciamento de Alunos (CRUD)

- **Inclusão de alunos**: Criação com validação rigorosa de dados (nome não vazio, CPF único e válido, e-mail válido)
- **Alteração de dados**: Edição com re-validação de CPF (não permitir duplicação), preservação de ID
- **Remoção de alunos**: Exclusão lógica e física com tratamento de referências
- **Listagem**: Visualização de todos os alunos cadastrados com filtros básicos
- **Persistência**: Armazenamento em arquivo JSON local via fs/promises (sem banco de dados)

## Technical Design

### Estrutura de Dados (data/alunos.json)

```json
{
  "alunos": [
    {
      "id": "uuid-v4",
      "nome": "string (obrigatório, 3-255 caracteres)",
      "cpf": "string (11 dígitos, único, não vazio)",
      "email": "string (formato válido, não vazio)",
      "criadoEm": "ISO8601",
      "atualizadoEm": "ISO8601"
    }
  ]
}
```

### Validações Críticas

1. **CPF**: 11 dígitos, único no sistema, não em branco
2. **Email**: Formato válido (regex), não duplicável, não vazio
3. **Nome**: Mínimo 3 caracteres, máximo 255, não vazio
4. **Campos obrigatórios**: nome, cpf, email

### Regras de Negócio

- CPF duplicado: rejeitar com mensagem clara
- E-mail inválido: validar formato antes de persistir
- Remoção de aluno: permitir remoção apenas se não houver avaliações vinculadas
- ID gerado: UUID v4 automático ao criar
- Timestamps: criadoEm e atualizadoEm registrados automaticamente

## Capabilities

### New Capabilities

- **gerenciamento-de-alunos**: CRUD de alunos com validação completa, persistência JSON, interface React com tabela e formulário

### Modified Capabilities

Nenhuma capacidade existente é modificada nesta iteração.

## Impact

- **Frontend**: Nova página React em `/pages/Alunos.tsx` com formulário de criação/edição e tabela de listagem
- **Backend**: Endpoints REST:
  - `POST /api/alunos` - criar aluno
  - `GET /api/alunos` - listar alunos
  - `GET /api/alunos/:id` - obter aluno por ID
  - `PUT /api/alunos/:id` - atualizar aluno
  - `DELETE /api/alunos/:id` - remover aluno
- **Persistência**: Arquivo `data/alunos.json` gerenciado via `fs/promises`
- **Validação**: Implementada no backend (regra "confiança zero na entrada")
- **Testes**: Cenários BDD em Gherkin cobrindo casos de sucesso e validação