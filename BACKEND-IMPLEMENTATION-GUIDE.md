# 🔧 Guia para Backend-Agent: Implementar a API para Passar nos Testes

**Para**: @backend-agent  
**Objetivo**: Implementar REST API que passe nos 9 testes de CRIAÇÃO criados pelo @test-agent  
**Status Atual**: 🔴 FASE RED - Testes falham com 503 (API não existe)

---

## 🎯 Objetivo

Implementar a funcionalidade **POST /api/alunos** com validações, que faça os 9 testes passarem (Fase GREEN do TDD).

---

## 📋 Requisitos Funcionais

### Endpoint: POST /api/alunos

**Responsabilidade**: Criar um novo aluno com validações

### Validações em Ordem (Primeira falha retorna erro)

1. **Nome obrigatório** → 400 + "Nome é obrigatório"
2. **Nome mínimo 3 chars** → 400 + "Nome deve ter no mínimo 3 caracteres"
3. **CPF obrigatório** → 400 + "CPF é obrigatório"
4. **CPF exatamente 11 dígitos** → 400 + "CPF deve conter 11 dígitos"
5. **CPF único (verificar arquivo)** → 409 + "CPF já cadastrado"
6. **Email obrigatório** → 400 + "E-mail é obrigatório"
7. **Email válido (regex)** → 400 + "E-mail inválido"
8. **Email único (verificar arquivo)** → 409 + "E-mail já cadastrado"

### Sucesso: Retornar 201 Created

```json
{
  "id": "uuid-v4",
  "nome": "string",
  "cpf": "11 dígitos",
  "email": "válido",
  "criadoEm": "ISO8601",
  "atualizadoEm": "ISO8601"
}
```

---

## 🏗️ Arquitetura Esperada

```
Express App
    ↓
POST /api/alunos
    ↓
AlunoController.criar()
    ↓
AlunoService.criar()
    ↓
AlunoValidator.validar()  ← Retorna erro se falhar
    ↓
AlunoRepository.criar()
    ↓
fs/promises.writeFile() → data/alunos.json
    ↓
Retorna 201 + Aluno criado
```

---

## 💻 Estrutura de Código Esperada

### 1. main.ts (Iniciar servidor)

```typescript
// src/backend/server.ts
import express from 'express';
import routes from './config/routes.js';

const app = express();
app.use(express.json());
app.use(routes);

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}`);
});
```

### 2. Routes

```typescript
// src/backend/config/routes.ts
import { Router } from 'express';
import { AlunoController } from '../controllers/AlunoController.js';

const router = Router();
const controller = new AlunoController();

router.post('/api/alunos', (req, res) => controller.criar(req, res));

export default router;
```

### 3. Controller

```typescript
// src/backend/controllers/AlunoController.ts
import { Request, Response } from 'express';
import { AlunoService } from '../services/AlunoService.js';

export class AlunoController {
  private service = new AlunoService();

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const aluno = await this.service.criar(req.body);
      res.status(201).json(aluno);
    } catch (erro) {
      this.handleError(res, erro);
    }
  }

  private handleError(res: Response, erro: unknown): void {
    const message = erro instanceof Error ? erro.message : 'Erro desconhecido';

    if (message.includes('já cadastrado') || message.includes('já existe')) {
      res.status(409).json({ erro: message });
    } else if (message.includes('obrigatório') || message.includes('inválido')) {
      res.status(400).json({ erro: message });
    } else {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}
```

### 4. Service

```typescript
// src/backend/services/AlunoService.ts
import { CriarAlunoDTO, Aluno } from '../../shared/types/aluno.types.js';
import { AlunoValidator } from '../validators/AlunoValidator.js';
import { AlunoRepository } from '../repositories/AlunoRepository.js';

export class AlunoService {
  private validator = new AlunoValidator();
  private repository = new AlunoRepository();

  async criar(dados: CriarAlunoDTO): Promise<Aluno> {
    // Validar dados
    await this.validator.validarCriacao(dados);

    // Criar e persistir
    return this.repository.criar(dados);
  }
}
```

### 5. Validator

```typescript
// src/backend/validators/AlunoValidator.ts
import { CriarAlunoDTO } from '../../shared/types/aluno.types.js';
import { AlunoRepository } from '../repositories/AlunoRepository.js';

export class AlunoValidator {
  private repository = new AlunoRepository();

  async validarCriacao(dados: CriarAlunoDTO): Promise<void> {
    // 1. Nome obrigatório
    if (!dados.nome || dados.nome.trim() === '') {
      throw new Error('Nome é obrigatório');
    }

    // 2. Nome mínimo 3 chars
    if (dados.nome.trim().length < 3) {
      throw new Error('Nome deve ter no mínimo 3 caracteres');
    }

    // 3. CPF obrigatório
    if (!dados.cpf || dados.cpf.trim() === '') {
      throw new Error('CPF é obrigatório');
    }

    // 4. CPF 11 dígitos
    if (!/^\d{11}$/.test(dados.cpf)) {
      throw new Error('CPF deve conter 11 dígitos');
    }

    // 5. CPF único
    const cpfExiste = await this.repository.cpfExiste(dados.cpf);
    if (cpfExiste) {
      throw new Error('CPF já cadastrado');
    }

    // 6. Email obrigatório
    if (!dados.email || dados.email.trim() === '') {
      throw new Error('E-mail é obrigatório');
    }

    // 7. Email válido
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(dados.email)) {
      throw new Error('E-mail inválido');
    }

    // 8. Email único
    const emailExiste = await this.repository.emailExiste(dados.email);
    if (emailExiste) {
      throw new Error('E-mail já cadastrado');
    }
  }
}
```

### 6. Repository

```typescript
// src/backend/repositories/AlunoRepository.ts
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Aluno, CriarAlunoDTO } from '../../shared/types/aluno.types.js';

const ALUNOS_FILE = path.join(process.cwd(), 'data', 'alunos.json');

interface AlunosData {
  alunos: Aluno[];
}

export class AlunoRepository {
  async criar(dados: CriarAlunoDTO): Promise<Aluno> {
    const alunos = await this.obterTodos();

    const novoAluno: Aluno = {
      id: uuidv4(),
      nome: dados.nome,
      cpf: dados.cpf,
      email: dados.email,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    alunos.push(novoAluno);
    await this.salvarArquivo({ alunos });
    return novoAluno;
  }

  async cpfExiste(cpf: string): Promise<boolean> {
    const alunos = await this.obterTodos();
    return alunos.some(a => a.cpf === cpf);
  }

  async emailExiste(email: string): Promise<boolean> {
    const alunos = await this.obterTodos();
    return alunos.some(a => a.email === email);
  }

  private async obterTodos(): Promise<Aluno[]> {
    try {
      const conteudo = await fs.readFile(ALUNOS_FILE, 'utf-8');
      const dados: AlunosData = JSON.parse(conteudo);
      return dados.alunos;
    } catch (erro) {
      // Arquivo não existe ainda
      return [];
    }
  }

  private async salvarArquivo(dados: AlunosData): Promise<void> {
    await fs.writeFile(ALUNOS_FILE, JSON.stringify(dados, null, 2), 'utf-8');
  }
}
```

---

## 🚀 Passos de Implementação

### 1. Setup Inicial

```bash
# Instalar dependências (já está no package.json)
npm install

# Criar estrutura de diretórios
mkdir -p src/backend/{controllers,services,validators,repositories,config}
mkdir -p src/shared/types
mkdir -p data
```

### 2. Criar Tipos (já existe)

```bash
# Arquivo já criado: src/shared/types/aluno.types.ts
```

### 3. Implementar Repository

```bash
# Arquivo a criar: src/backend/repositories/AlunoRepository.ts
# Responsabilidade: CRUD em JSON + verificar duplicatas
```

### 4. Implementar Validator

```bash
# Arquivo a criar: src/backend/validators/AlunoValidator.ts
# Responsabilidade: 8 validações em ordem
```

### 5. Implementar Service

```bash
# Arquivo a criar: src/backend/services/AlunoService.ts
# Responsabilidade: Orquestrar Validator + Repository
```

### 6. Implementar Controller

```bash
# Arquivo a criar: src/backend/controllers/AlunoController.ts
# Responsabilidade: Handler HTTP + mapeamento de erros
```

### 7. Configurar Rotas

```bash
# Arquivo a criar: src/backend/config/routes.ts
# Responsabilidade: POST /api/alunos
```

### 8. Criar Server

```bash
# Arquivo a criar: src/backend/server.ts
# Responsabilidade: Iniciar Express no port 3000
```

---

## ✅ Checklist de Implementação

- [ ] Repository criado e funcional (CRUD JSON)
- [ ] Repository verifica CPF duplicado
- [ ] Repository verifica Email duplicado
- [ ] Validator implementado (8 validações)
- [ ] Service criado (orquestra Validator + Repository)
- [ ] Controller criado com error handler
- [ ] Rotas registradas
- [ ] Server iniciando em port 3000
- [ ] npm run dev funciona
- [ ] npm run test:creation retorna ✅

---

## 🧪 Teste Manual (antes de rodar Cucumber)

```bash
# Terminal 1: Iniciar API
npm run dev

# Terminal 2: Testar com curl
curl -X POST http://localhost:3000/api/alunos \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","cpf":"12345678901","email":"joao@example.com"}'

# Esperado: 201 Created + aluno com ID e timestamps
```

---

## 🧪 Rodar Testes de Teste

```bash
# Terminal 1: Manter API rodando
npm run dev

# Terminal 2: Rodar testes de CRIAÇÃO
npm run test:creation

# Esperado: ✅ 9 cenários passando
```

---

## 📊 Resultados Esperados

### Antes (🔴 RED)
```
❌ 9 cenários falhando com 503 (API não existe)
Status: FASE RED
```

### Depois (🟢 GREEN)
```
✅ 1 sucesso
  - Criar aluno com dados válidos → 201 Created

✅ 8 falhas esperadas
  - CPF vazio → 400
  - CPF 10 dígitos → 400
  - CPF duplicado → 409
  - Email vazio → 400
  - Email inválido → 400
  - Email duplicado → 409
  - Nome vazio → 400
  - Nome < 3 chars → 400

Status: FASE GREEN - Todos os testes passando
```

---

## 🔍 Ordem de Validação (CRÍTICO)

A ordem importa! O teste espera o **primeiro erro encontrado**.

```
1️⃣ Nome obrigatório
2️⃣ Nome mínimo 3 chars
3️⃣ CPF obrigatório
4️⃣ CPF 11 dígitos
5️⃣ CPF único
6️⃣ Email obrigatório
7️⃣ Email válido
8️⃣ Email único
```

**Exemplo**: Se nome está vazio E CPF inválido, retornar erro do nome (1º).

---

## 📝 Arquivo JSON Esperado

### Antes (vazio)
```json
{
  "alunos": []
}
```

### Depois de criar João
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

## 📌 Lembre-se

- ✅ **Usar fs/promises** (não banco de dados)
- ✅ **UUID v4** para IDs (não sequencial)
- ✅ **ISO8601** para timestamps
- ✅ **criadoEm nunca muda** após criação
- ✅ **atualizadoEm** iguala criadoEm na criação
- ✅ **Validação em camadas** (Controller → Service → Validator → Repository)
- ✅ **Tratamento de erros semântico** (400, 409 etc)

---

## 🚨 Erros Comuns

| Erro | Solução |
|------|---------|
| 503 Service Unavailable | Implementar servidor Express |
| criadoEm != atualizadoEm | Ambos devem ser iguais na criação |
| ID não é UUID | Usar `uuid.v4()` |
| Aceita CPF com 10 dígitos | Validar exatamente 11 (`/^\d{11}$/`) |
| Não verifica duplicatas | Ler arquivo antes de validar |
| Ordem de validação errada | Seguir os 8 passos na ordem |

---

## 📞 Próximas Etapas

1. ✅ Implementar POST /api/alunos
2. ✅ Rodar `npm run test:creation`
3. ✅ Todos os testes devem passar ✅
4. ⏳ Próximo: Implementar GET /api/alunos (LISTAGEM)
5. ⏳ Próximo: Implementar PUT /api/alunos/:id (ATUALIZAÇÃO)
6. ⏳ Próximo: Implementar DELETE /api/alunos/:id (REMOÇÃO)

---

## 📎 Referências

- [Especificação Técnica](openspec/changes/gerenciamento-de-alunos/specs/gerenciamento-de-alunos/spec.md)
- [API Contract](tests/API-CONTRACT.md)
- [Tests README](tests/README.md)
- [Cenários Gherkin](tests/features/alunos-criacao.feature)

---

**Boa sorte! 🚀**

Quando a implementação estiver pronta, execute:
```bash
npm run test:creation
```

Se todos os testes passarem, você completou com sucesso a Fase GREEN do TDD!
