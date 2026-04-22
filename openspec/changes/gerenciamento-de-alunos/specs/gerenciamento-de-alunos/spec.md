# Especificação Técnica: Gerenciamento de Alunos

## Contexto
Sistema web de gestão acadêmica com persistência em JSON. O módulo de gerenciamento de alunos fornece CRUD completo com validação de dados e armazenamento em arquivo local.

## Estrutura de Dados

### Schema Aluno (data/alunos.json)
```typescript
interface Aluno {
  id: string;           // UUID v4, gerado automaticamente
  nome: string;         // Obrigatório, 3-255 caracteres
  cpf: string;          // Obrigatório, 11 dígitos, único
  email: string;        // Obrigatório, formato válido, único
  criadoEm: string;     // ISO8601, timestamp automático
  atualizadoEm: string; // ISO8601, timestamp automático
}
```

---

## Cenários de Teste (Gherkin - Português)

### Funcionalidade: Criar Aluno

#### Cenário 1: Criar aluno com dados válidos
```gherkin
# language: pt-br
Funcionalidade: Criar novo aluno
  Como gerenciador do sistema
  Desejo criar um novo aluno
  Para manter o cadastro atualizado

  Cenário: Inclusão bem-sucedida de aluno com dados válidos
    Dado que o sistema de alunos está inicializado
    E o arquivo de alunos contém 0 registros
    Quando eu submeto um novo aluno com os seguintes dados:
      | nome  | João Silva         |
      | cpf   | 12345678901        |
      | email | joao@example.com   |
    Então o aluno deve ser criado com sucesso
    E o sistema deve retornar o ID do aluno criado
    E o arquivo data/alunos.json deve conter 1 registro
    E os campos criadoEm e atualizadoEm devem ser iguais
```

#### Cenário 2: Rejeitar aluno com CPF em branco
```gherkin
  Cenário: Rejeição de aluno com CPF vazio
    Dado que o sistema de alunos está inicializado
    Quando eu submeto um novo aluno com os seguintes dados:
      | nome  | Maria Santos       |
      | cpf   |                    |
      | email | maria@example.com  |
    Então a operação deve falhar
    E a mensagem de erro deve conter "CPF é obrigatório"
    E o arquivo de alunos não deve ser modificado
```

#### Cenário 3: Rejeitar aluno com CPF duplicado
```gherkin
  Cenário: Rejeição de aluno com CPF duplicado
    Dado que o sistema de alunos está inicializado
    E um aluno com CPF "12345678901" já existe
    Quando eu submeto um novo aluno com os seguintes dados:
      | nome  | Outro João         |
      | cpf   | 12345678901        |
      | email | outro@example.com  |
    Então a operação deve falhar
    E a mensagem de erro deve conter "CPF já cadastrado"
    E o total de alunos deve permanecer em 1
```

#### Cenário 4: Rejeitar aluno com e-mail inválido
```gherkin
  Cenário: Rejeição de aluno com e-mail em formato inválido
    Dado que o sistema de alunos está inicializado
    Quando eu submeto um novo aluno com os seguintes dados:
      | nome  | Pedro Oliveira     |
      | cpf   | 98765432109        |
      | email | email-invalido     |
    Então a operação deve falhar
    E a mensagem de erro deve conter "E-mail inválido"
    E o arquivo de alunos não deve ser modificado
```

#### Cenário 5: Rejeitar aluno com nome vazio
```gherkin
  Cenário: Rejeição de aluno com nome vazio
    Dado que o sistema de alunos está inicializado
    Quando eu submeto um novo aluno com os seguintes dados:
      | nome  |                    |
      | cpf   | 55555555555        |
      | email | teste@example.com  |
    Então a operação deve falhar
    E a mensagem de erro deve conter "Nome é obrigatório"
    E o arquivo de alunos não deve ser modificado
```

#### Cenário 6: Rejeitar aluno com nome muito curto
```gherkin
  Cenário: Rejeição de aluno com nome abaixo do mínimo de caracteres
    Dado que o sistema de alunos está inicializado
    Quando eu submeto um novo aluno com os seguintes dados:
      | nome  | AB                 |
      | cpf   | 44444444444        |
      | email | ab@example.com     |
    Então a operação deve falhar
    E a mensagem de erro deve conter "Nome deve ter no mínimo 3 caracteres"
    E o arquivo de alunos não deve ser modificado
```

---

### Funcionalidade: Listar Alunos

#### Cenário 7: Listar alunos quando nenhum está cadastrado
```gherkin
  Cenário: Listagem de alunos vazia
    Dado que o sistema de alunos está inicializado
    E o arquivo de alunos não contém registros
    Quando eu solicito a listagem de todos os alunos
    Então a operação deve retornar uma lista vazia
    E o status deve ser sucesso
```

#### Cenário 8: Listar múltiplos alunos cadastrados
```gherkin
  Cenário: Listagem com múltiplos alunos
    Dado que o sistema de alunos está inicializado
    E os seguintes alunos estão cadastrados:
      | nome           | cpf         | email              |
      | João Silva     | 12345678901 | joao@example.com   |
      | Maria Santos   | 98765432109 | maria@example.com  |
      | Pedro Oliveira | 55555555555 | pedro@example.com  |
    Quando eu solicito a listagem de todos os alunos
    Então o sistema deve retornar 3 alunos
    E cada aluno deve conter os campos: id, nome, cpf, email, criadoEm, atualizadoEm
    E os dados devem estar completos e corretos
```

---

### Funcionalidade: Obter Aluno por ID

#### Cenário 9: Obter aluno existente pelo ID
```gherkin
  Cenário: Recuperação de aluno pelo ID
    Dado que o sistema de alunos está inicializado
    E um aluno com ID "uuid-001" e nome "João Silva" existe
    Quando eu solicito os dados do aluno com ID "uuid-001"
    Então o sistema deve retornar os dados completos do aluno
    E o nome deve ser "João Silva"
    E todos os campos devem estar preenchidos
```

#### Cenário 10: Falha ao buscar aluno inexistente
```gherkin
  Cenário: Busca de aluno que não existe
    Dado que o sistema de alunos está inicializado
    Quando eu solicito os dados do aluno com ID "id-inexistente"
    Então a operação deve falhar
    E a mensagem de erro deve conter "Aluno não encontrado"
```

---

### Funcionalidade: Atualizar Aluno

#### Cenário 11: Atualizar dados de aluno com sucesso
```gherkin
  Cenário: Atualização bem-sucedida de dados do aluno
    Dado que o sistema de alunos está inicializado
    E um aluno com ID "uuid-001" está cadastrado com os dados:
      | nome  | João Silva         |
      | cpf   | 12345678901        |
      | email | joao@example.com   |
    Quando eu atualizo o aluno com ID "uuid-001" com os seguintes dados:
      | nome  | João da Silva      |
      | email | joao.silva@ex.com  |
    Então a operação deve ser bem-sucedida
    E o aluno deve conter os novos dados
    E o CPF deve permanecer "12345678901"
    E o campo atualizadoEm deve ser mais recente que criadoEm
    E o ID deve permanecer "uuid-001"
```

#### Cenário 12: Rejeitar atualização com CPF duplicado
```gherkin
  Cenário: Falha ao atualizar aluno com CPF já cadastrado
    Dado que o sistema de alunos está inicializado
    E dois alunos estão cadastrados:
      | id        | nome           | cpf         |
      | uuid-001  | João Silva     | 12345678901 |
      | uuid-002  | Maria Santos   | 98765432109 |
    Quando eu atualizo o aluno com ID "uuid-001" tentando usar o CPF "98765432109"
    Então a operação deve falhar
    E a mensagem de erro deve conter "CPF já cadastrado"
    E os dados do aluno "uuid-001" devem permanecer inalterados
```

#### Cenário 13: Rejeitar atualização com e-mail inválido
```gherkin
  Cenário: Falha ao atualizar com e-mail em formato inválido
    Dado que o sistema de alunos está inicializado
    E um aluno com ID "uuid-001" está cadastrado
    Quando eu atualizo o aluno com ID "uuid-001" com o e-mail "invalido@"
    Então a operação deve falhar
    E a mensagem de erro deve conter "E-mail inválido"
    E os dados do aluno devem permanecer inalterados
```

---

### Funcionalidade: Remover Aluno

#### Cenário 14: Remover aluno com sucesso
```gherkin
  Cenário: Exclusão bem-sucedida de aluno
    Dado que o sistema de alunos está inicializado
    E três alunos estão cadastrados
    E o aluno com ID "uuid-001" tem nome "João Silva"
    Quando eu removo o aluno com ID "uuid-001"
    Então a operação deve ser bem-sucedida
    E o arquivo de alunos deve conter 2 registros
    E uma posterior busca pelo ID "uuid-001" deve falhar
```

#### Cenário 15: Falha ao remover aluno inexistente
```gherkin
  Cenário: Tentativa de remover aluno que não existe
    Dado que o sistema de alunos está inicializado
    E o total de alunos é 2
    Quando eu tento remover o aluno com ID "id-inexistente"
    Então a operação deve falhar
    E a mensagem de erro deve conter "Aluno não encontrado"
    E o total de alunos deve permanecer em 2
```

---

## Validações de Entrada (Backend)

### CPF
- Deve conter exatamente 11 dígitos
- Não pode ser vazio ou nulo
- Deve ser único no sistema
- Validação: regex `^\d{11}$` e verificação de unicidade no arquivo

### Email
- Deve estar em formato válido
- Não pode ser vazio ou nulo
- Deve ser único no sistema
- Validação: regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` e verificação de unicidade

### Nome
- Mínimo 3 caracteres, máximo 255
- Não pode ser vazio ou nulo
- Validação: comprimento e trim

### ID
- Gerado automaticamente com UUID v4
- Imutável após criação
- Usado como chave primária no arquivo JSON

---

## Integração com Persistência JSON

### Arquivo: data/alunos.json
```json
{
  "alunos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nome": "João Silva",
      "cpf": "12345678901",
      "email": "joao@example.com",
      "criadoEm": "2026-04-22T10:30:00Z",
      "atualizadoEm": "2026-04-22T10:30:00Z"
    }
  ]
}
```

### Operações via fs/promises
- **Leitura**: `fs.readFile()` com tratamento de arquivo não existente
- **Escrita**: `fs.writeFile()` com formatação JSON indentada
- **Validação**: Verificar duplicatas antes de escrever
- **Atomicidade**: Leitura completa → validação → escrita completa

---

## Casos de Erro Esperados

| Código | Mensagem | Trigger |
|--------|----------|---------|
| 400 | CPF é obrigatório | CPF vazio |
| 400 | CPF deve conter 11 dígitos | CPF com comprimento ≠ 11 |
| 409 | CPF já cadastrado | CPF duplicado |
| 400 | E-mail é obrigatório | Email vazio |
| 400 | E-mail inválido | Email fora do padrão |
| 409 | E-mail já cadastrado | Email duplicado |
| 400 | Nome é obrigatório | Nome vazio |
| 400 | Nome deve ter no mínimo 3 caracteres | Nome.length < 3 |
| 404 | Aluno não encontrado | ID inexistente em GET/PUT/DELETE |
| 500 | Erro ao ler arquivo de alunos | I/O error em fs |
| 500 | Erro ao salvar aluno | I/O error em fs |

---

## Endpoints REST (API Contract)

### POST /api/alunos
**Request:**
```json
{
  "nome": "João Silva",
  "cpf": "12345678901",
  "email": "joao@example.com"
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "João Silva",
  "cpf": "12345678901",
  "email": "joao@example.com",
  "criadoEm": "2026-04-22T10:30:00Z",
  "atualizadoEm": "2026-04-22T10:30:00Z"
}
```

### GET /api/alunos
**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "João Silva",
    "cpf": "12345678901",
    "email": "joao@example.com",
    "criadoEm": "2026-04-22T10:30:00Z",
    "atualizadoEm": "2026-04-22T10:30:00Z"
  }
]
```

### GET /api/alunos/:id
**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "João Silva",
  "cpf": "12345678901",
  "email": "joao@example.com",
  "criadoEm": "2026-04-22T10:30:00Z",
  "atualizadoEm": "2026-04-22T10:30:00Z"
}
```

### PUT /api/alunos/:id
**Request:**
```json
{
  "nome": "João da Silva",
  "cpf": "12345678901",
  "email": "joao.silva@example.com"
}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "João da Silva",
  "cpf": "12345678901",
  "email": "joao.silva@example.com",
  "criadoEm": "2026-04-22T10:30:00Z",
  "atualizadoEm": "2026-04-22T10:45:00Z"
}
```

### DELETE /api/alunos/:id
**Response (204 No Content)**

---

## Regras de Teste

1. Cada cenário deve ser independente (isolamento de dados)
2. Limpar arquivo data/alunos.json antes de cada teste
3. Validar tanto sucesso quanto falha
4. Verificar persistência (arquivo foi realmente alterado)
5. Testar ordem de validação (campo obrigatório antes de formato)
