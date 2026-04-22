# 📋 API Contract - Gerenciamento de Alunos

Este documento define o contrato esperado pela API que os testes estão verificando.

## Endpoint: POST /api/alunos

**Descrição**: Criar um novo aluno

### Request

```http
POST /api/alunos HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "nome": "João Silva",
  "cpf": "12345678901",
  "email": "joao@example.com"
}
```

### Response - Sucesso (201 Created)

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "João Silva",
  "cpf": "12345678901",
  "email": "joao@example.com",
  "criadoEm": "2026-04-22T14:30:00.000Z",
  "atualizadoEm": "2026-04-22T14:30:00.000Z"
}
```

---

## Respostas de Erro para POST /api/alunos

### 1. CPF Vazio (400 Bad Request)

**Request:**
```json
{
  "nome": "Maria Santos",
  "cpf": "",
  "email": "maria@example.com"
}
```

**Response:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "erro": "CPF é obrigatório"
}
```

---

### 2. CPF com Menos de 11 Dígitos (400 Bad Request)

**Request:**
```json
{
  "nome": "Pedro Costa",
  "cpf": "1234567890",
  "email": "pedro@example.com"
}
```

**Response:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "erro": "CPF deve conter 11 dígitos"
}
```

---

### 3. CPF Duplicado (409 Conflict)

**Cenário**: Um aluno com CPF "12345678901" já existe

**Request:**
```json
{
  "nome": "Outro João",
  "cpf": "12345678901",
  "email": "outro@example.com"
}
```

**Response:**
```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "erro": "CPF já cadastrado"
}
```

---

### 4. Email Vazio (400 Bad Request)

**Request:**
```json
{
  "nome": "Ana Silva",
  "cpf": "11111111111",
  "email": ""
}
```

**Response:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "erro": "E-mail é obrigatório"
}
```

---

### 5. Email em Formato Inválido (400 Bad Request)

**Request:**
```json
{
  "nome": "Carlos Mendes",
  "cpf": "22222222222",
  "email": "email-invalido"
}
```

**Response:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "erro": "E-mail inválido"
}
```

---

### 6. Email Duplicado (409 Conflict)

**Cenário**: Um aluno com email "joao@example.com" já existe

**Request:**
```json
{
  "nome": "João Silva II",
  "cpf": "33333333333",
  "email": "joao@example.com"
}
```

**Response:**
```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "erro": "E-mail já cadastrado"
}
```

---

### 7. Nome Vazio (400 Bad Request)

**Request:**
```json
{
  "nome": "",
  "cpf": "44444444444",
  "email": "teste@example.com"
}
```

**Response:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "erro": "Nome é obrigatório"
}
```

---

### 8. Nome com Menos de 3 Caracteres (400 Bad Request)

**Request:**
```json
{
  "nome": "AB",
  "cpf": "55555555555",
  "email": "ab@example.com"
}
```

**Response:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "erro": "Nome deve ter no mínimo 3 caracteres"
}
```

---

### 9. Múltiplos Campos Inválidos (400 Bad Request)

**Request:**
```json
{
  "nome": "",
  "cpf": "123",
  "email": "invalido"
}
```

**Response:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "erro": "Nome é obrigatório"
}
```

**Nota**: Validar na ordem: Nome → CPF → Email. Retornar o primeiro erro encontrado.

---

## Regras de Validação (Ordem Esperada)

1. **Obrigatoriedade**:
   - Nome não vazio
   - CPF não vazio
   - Email não vazio

2. **Formato**:
   - Nome: 3-255 caracteres
   - CPF: exatamente 11 dígitos
   - Email: válido (regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$`)

3. **Unicidade** (verificar no arquivo data/alunos.json):
   - CPF único
   - Email único

---

## Status Codes HTTP

| Código | Significado |
|--------|------------|
| 201 | Created - Aluno criado com sucesso |
| 400 | Bad Request - Validação falhou |
| 409 | Conflict - CPF/Email duplicado |
| 503 | Service Unavailable - API não foi implementada (Fase RED) |

---

## Estrutura do Arquivo data/alunos.json (Persistência)

```json
{
  "alunos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nome": "João Silva",
      "cpf": "12345678901",
      "email": "joao@example.com",
      "criadoEm": "2026-04-22T14:30:00.000Z",
      "atualizadoEm": "2026-04-22T14:30:00.000Z"
    }
  ]
}
```

---

## Observações para Implementação

1. **ID**: Gerar com UUID v4 (não sequencial)
2. **Timestamps**: Usar ISO8601 (UTC)
3. **criadoEm**: Nunca mudar após criação
4. **atualizadoEm**: Atualizar a cada modificação
5. **Atomicidade**: Ler → Validar → Escrever (tudo ou nada)
6. **Persistência**: Via fs/promises (sem banco de dados)

---

## Como Usar Este Documento

### Para Backend-Agent
Use este contrato para implementar exatamente o que os testes esperam.

### Para Testar Manualmente (curl)

```bash
# Criar aluno válido
curl -X POST http://localhost:3000/api/alunos \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","cpf":"12345678901","email":"joao@example.com"}'

# Tentar criar com CPF vazio (deve falhar com 400)
curl -X POST http://localhost:3000/api/alunos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria","cpf":"","email":"maria@example.com"}'
```

---

**Versão**: 1.0  
**Data**: 2026-04-22  
**Status**: Pronto para implementação backend
