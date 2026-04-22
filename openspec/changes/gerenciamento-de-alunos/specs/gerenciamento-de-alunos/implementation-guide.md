# Guia de Implementação: Gerenciamento de Alunos

## Visão Geral
Este documento descreve a arquitetura, estrutura de diretórios e diretrizes de implementação para o módulo de Gerenciamento de Alunos.

---

## Estrutura de Diretórios

```
projeto/
├── src/
│   ├── backend/
│   │   ├── services/
│   │   │   └── AlunoService.ts
│   │   ├── controllers/
│   │   │   └── AlunoController.ts
│   │   ├── validators/
│   │   │   └── AlunoValidator.ts
│   │   ├── repositories/
│   │   │   └── AlunoRepository.ts
│   │   └── types/
│   │       └── aluno.types.ts
│   ├── frontend/
│   │   ├── pages/
│   │   │   └── Alunos.tsx
│   │   ├── components/
│   │   │   ├── AlunoForm.tsx
│   │   │   ├── AlunoTable.tsx
│   │   │   └── AlunoModal.tsx
│   │   └── hooks/
│   │       └── useAlunos.ts
│   └── shared/
│       └── types/
│           └── aluno.types.ts
├── data/
│   └── alunos.json (gerado em tempo de execução)
├── tests/
│   ├── features/
│   │   └── alunos.feature
│   └── steps/
│       └── alunos.steps.ts
└── src/config/
    └── routes.ts
```

---

## Tipos TypeScript (Tipagem Forte)

### src/shared/types/aluno.types.ts
```typescript
export interface Aluno {
  id: string;           // UUID v4
  nome: string;         // 3-255 caracteres
  cpf: string;          // 11 dígitos
  email: string;        // Email válido
  criadoEm: string;     // ISO8601
  atualizadoEm: string; // ISO8601
}

export interface CriarAlunoDTO {
  nome: string;
  cpf: string;
  email: string;
}

export interface AtualizarAlunoDTO {
  nome?: string;
  cpf?: string;
  email?: string;
}

export interface AlunoResponse {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ErroValidacao {
  campo: string;
  mensagem: string;
  codigo: number;
}
```

---

## Camada de Repositório (Persistência JSON)

### src/backend/repositories/AlunoRepository.ts
```typescript
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Aluno, CriarAlunoDTO, AtualizarAlunoDTO } from '../../shared/types/aluno.types';
import path from 'path';

const ALUNOS_FILE = path.join(process.cwd(), 'data', 'alunos.json');

interface AlunosData {
  alunos: Aluno[];
}

export class AlunoRepository {
  // Lê todas as alunos do arquivo
  async obterTodos(): Promise<Aluno[]> {
    try {
      const dados = await this.lerArquivo();
      return dados.alunos;
    } catch (erro) {
      if ((erro as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw new Error('Erro ao ler arquivo de alunos');
    }
  }

  // Obtém aluno específico por ID
  async obterPorId(id: string): Promise<Aluno | null> {
    const alunos = await this.obterTodos();
    return alunos.find(a => a.id === id) || null;
  }

  // Verifica se CPF já existe
  async cpfExiste(cpf: string, excluirId?: string): Promise<boolean> {
    const alunos = await this.obterTodos();
    return alunos.some(a => a.cpf === cpf && a.id !== excluirId);
  }

  // Verifica se email já existe
  async emailExiste(email: string, excluirId?: string): Promise<boolean> {
    const alunos = await this.obterTodos();
    return alunos.some(a => a.email === email && a.id !== excluirId);
  }

  // Cria novo aluno
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

  // Atualiza aluno existente
  async atualizar(id: string, dados: AtualizarAlunoDTO): Promise<Aluno> {
    const alunos = await this.obterTodos();
    const indice = alunos.findIndex(a => a.id === id);

    if (indice === -1) {
      throw new Error('Aluno não encontrado');
    }

    const alunoExistente = alunos[indice];
    const alunoAtualizado: Aluno = {
      ...alunoExistente,
      nome: dados.nome ?? alunoExistente.nome,
      cpf: dados.cpf ?? alunoExistente.cpf,
      email: dados.email ?? alunoExistente.email,
      atualizadoEm: new Date().toISOString(),
    };

    alunos[indice] = alunoAtualizado;
    await this.salvarArquivo({ alunos });
    return alunoAtualizado;
  }

  // Remove aluno
  async remover(id: string): Promise<void> {
    const alunos = await this.obterTodos();
    const indice = alunos.findIndex(a => a.id === id);

    if (indice === -1) {
      throw new Error('Aluno não encontrado');
    }

    alunos.splice(indice, 1);
    await this.salvarArquivo({ alunos });
  }

  // Métodos privados
  private async lerArquivo(): Promise<AlunosData> {
    const conteudo = await fs.readFile(ALUNOS_FILE, 'utf-8');
    return JSON.parse(conteudo);
  }

  private async salvarArquivo(dados: AlunosData): Promise<void> {
    await fs.writeFile(ALUNOS_FILE, JSON.stringify(dados, null, 2), 'utf-8');
  }
}
```

---

## Camada de Validação

### src/backend/validators/AlunoValidator.ts
```typescript
import { CriarAlunoDTO, AtualizarAlunoDTO, ErroValidacao } from '../../shared/types/aluno.types';
import { AlunoRepository } from '../repositories/AlunoRepository';

export class AlunoValidator {
  private repository = new AlunoRepository();

  // Validações para criação
  async validarCriacao(dados: CriarAlunoDTO): Promise<void> {
    this.validarNome(dados.nome);
    this.validarCpf(dados.cpf);
    await this.validarCpfDuplicado(dados.cpf);
    this.validarEmail(dados.email);
    await this.validarEmailDuplicado(dados.email);
  }

  // Validações para atualização
  async validarAtualizacao(dados: AtualizarAlunoDTO, alunoIdExistente: string): Promise<void> {
    if (dados.nome !== undefined) {
      this.validarNome(dados.nome);
    }
    if (dados.cpf !== undefined) {
      this.validarCpf(dados.cpf);
      await this.validarCpfDuplicado(dados.cpf, alunoIdExistente);
    }
    if (dados.email !== undefined) {
      this.validarEmail(dados.email);
      await this.validarEmailDuplicado(dados.email, alunoIdExistente);
    }
  }

  // Validações individuais
  private validarNome(nome: string | undefined): void {
    if (!nome || nome.trim() === '') {
      throw new Error('Nome é obrigatório');
    }
    if (nome.trim().length < 3) {
      throw new Error('Nome deve ter no mínimo 3 caracteres');
    }
    if (nome.length > 255) {
      throw new Error('Nome não pode exceder 255 caracteres');
    }
  }

  private validarCpf(cpf: string | undefined): void {
    if (!cpf || cpf.trim() === '') {
      throw new Error('CPF é obrigatório');
    }
    if (!/^\d{11}$/.test(cpf)) {
      throw new Error('CPF deve conter 11 dígitos');
    }
  }

  private async validarCpfDuplicado(cpf: string, excluirId?: string): Promise<void> {
    const existe = await this.repository.cpfExiste(cpf, excluirId);
    if (existe) {
      throw new Error('CPF já cadastrado');
    }
  }

  private validarEmail(email: string | undefined): void {
    if (!email || email.trim() === '') {
      throw new Error('E-mail é obrigatório');
    }
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      throw new Error('E-mail inválido');
    }
  }

  private async validarEmailDuplicado(email: string, excluirId?: string): Promise<void> {
    const existe = await this.repository.emailExiste(email, excluirId);
    if (existe) {
      throw new Error('E-mail já cadastrado');
    }
  }
}
```

---

## Camada de Serviço (Business Logic)

### src/backend/services/AlunoService.ts
```typescript
import { Aluno, CriarAlunoDTO, AtualizarAlunoDTO } from '../../shared/types/aluno.types';
import { AlunoRepository } from '../repositories/AlunoRepository';
import { AlunoValidator } from '../validators/AlunoValidator';

export class AlunoService {
  private repository = new AlunoRepository();
  private validator = new AlunoValidator();

  async obterTodos(): Promise<Aluno[]> {
    return this.repository.obterTodos();
  }

  async obterPorId(id: string): Promise<Aluno> {
    const aluno = await this.repository.obterPorId(id);
    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }
    return aluno;
  }

  async criar(dados: CriarAlunoDTO): Promise<Aluno> {
    await this.validator.validarCriacao(dados);
    return this.repository.criar(dados);
  }

  async atualizar(id: string, dados: AtualizarAlunoDTO): Promise<Aluno> {
    // Verificar se aluno existe
    await this.obterPorId(id);
    
    // Validar dados
    await this.validator.validarAtualizacao(dados, id);
    
    // Atualizar
    return this.repository.atualizar(id, dados);
  }

  async remover(id: string): Promise<void> {
    // Verificar se aluno existe
    await this.obterPorId(id);
    
    // Remover
    await this.repository.remover(id);
  }
}
```

---

## Camada de Controller (HTTP Handler)

### src/backend/controllers/AlunoController.ts
```typescript
import { Request, Response } from 'express';
import { AlunoService } from '../services/AlunoService';
import { CriarAlunoDTO, AtualizarAlunoDTO } from '../../shared/types/aluno.types';

export class AlunoController {
  private service = new AlunoService();

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const dados: CriarAlunoDTO = req.body;
      const aluno = await this.service.criar(dados);
      res.status(201).json(aluno);
    } catch (erro) {
      this.handleError(res, erro);
    }
  }

  async obterTodos(req: Request, res: Response): Promise<void> {
    try {
      const alunos = await this.service.obterTodos();
      res.status(200).json(alunos);
    } catch (erro) {
      this.handleError(res, erro);
    }
  }

  async obterPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const aluno = await this.service.obterPorId(id);
      res.status(200).json(aluno);
    } catch (erro) {
      this.handleError(res, erro);
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dados: AtualizarAlunoDTO = req.body;
      const aluno = await this.service.atualizar(id, dados);
      res.status(200).json(aluno);
    } catch (erro) {
      this.handleError(res, erro);
    }
  }

  async remover(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.remover(id);
      res.status(204).send();
    } catch (erro) {
      this.handleError(res, erro);
    }
  }

  private handleError(res: Response, erro: unknown): void {
    const message = erro instanceof Error ? erro.message : 'Erro desconhecido';

    // Mapeamento de erros para HTTP status
    if (message.includes('não encontrado')) {
      res.status(404).json({ erro: message });
    } else if (message.includes('já cadastrado') || message.includes('já existe')) {
      res.status(409).json({ erro: message });
    } else if (message.includes('obrigatório') || message.includes('inválido')) {
      res.status(400).json({ erro: message });
    } else {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}
```

---

## Rotas Express

### Exemplo de configuração em src/config/routes.ts
```typescript
import { Router } from 'express';
import { AlunoController } from '../backend/controllers/AlunoController';

const router = Router();
const controller = new AlunoController();

// CRUD de Alunos
router.post('/api/alunos', (req, res) => controller.criar(req, res));
router.get('/api/alunos', (req, res) => controller.obterTodos(req, res));
router.get('/api/alunos/:id', (req, res) => controller.obterPorId(req, res));
router.put('/api/alunos/:id', (req, res) => controller.atualizar(req, res));
router.delete('/api/alunos/:id', (req, res) => controller.remover(req, res));

export default router;
```

---

## Frontend React

### src/frontend/pages/Alunos.tsx (Esboço)
```typescript
import React, { useEffect, useState } from 'react';
import { Aluno, CriarAlunoDTO } from '../../shared/types/aluno.types';
import AlunoForm from '../components/AlunoForm';
import AlunoTable from '../components/AlunoTable';
import AlunoModal from '../components/AlunoModal';

export default function Alunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);

  // Carregar alunos ao montar componente
  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      const response = await fetch('/api/alunos');
      const dados = await response.json();
      setAlunos(dados);
    } catch (erro) {
      console.error('Erro ao carregar alunos', erro);
    }
  };

  const handleCriar = async (dados: CriarAlunoDTO) => {
    try {
      const response = await fetch('/api/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (response.ok) {
        await carregarAlunos();
        setShowModal(false);
      }
    } catch (erro) {
      console.error('Erro ao criar aluno', erro);
    }
  };

  const handleEditar = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setShowModal(true);
  };

  const handleRemover = async (id: string) => {
    try {
      const response = await fetch(`/api/alunos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await carregarAlunos();
      }
    } catch (erro) {
      console.error('Erro ao remover aluno', erro);
    }
  };

  return (
    <div className="alunos-container">
      <h1>Gerenciamento de Alunos</h1>
      <button onClick={() => setShowModal(true)} data-testid="btn-novo-aluno">
        Novo Aluno
      </button>

      <AlunoTable
        alunos={alunos}
        onEditar={handleEditar}
        onRemover={handleRemover}
      />

      {showModal && (
        <AlunoModal
          aluno={selectedAluno}
          onSave={handleCriar}
          onClose={() => {
            setShowModal(false);
            setSelectedAluno(null);
          }}
        />
      )}
    </div>
  );
}
```

---

## Testes (Cucumber + Gherkin)

### Implementação de Steps (Esboço em src/tests/steps/alunos.steps.ts)
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { AlunoService } from '../../backend/services/AlunoService';
import { promises as fs } from 'fs';

const service = new AlunoService();
let resultado: any;
let erro: Error | null = null;

Given('que o sistema de alunos está inicializado', async () => {
  // Limpar arquivo antes do teste
  await fs.writeFile('data/alunos.json', JSON.stringify({ alunos: [] }, null, 2));
});

When('eu submeto um novo aluno com os seguintes dados:', async (dataTable) => {
  try {
    const dados = dataTable.rowsHash();
    resultado = await service.criar({
      nome: dados.nome,
      cpf: dados.cpf,
      email: dados.email,
    });
    erro = null;
  } catch (e) {
    erro = e as Error;
  }
});

Then('o aluno deve ser criado com sucesso', () => {
  expect(erro).to.be.null;
  expect(resultado).to.have.property('id');
  expect(resultado).to.have.property('criadoEm');
});

// ... mais steps
```

---

## Checklist de Implementação

- [ ] Criar estrutura de diretórios
- [ ] Implementar tipos TypeScript (aluno.types.ts)
- [ ] Implementar AlunoRepository com fs/promises
- [ ] Implementar AlunoValidator com todas as validações
- [ ] Implementar AlunoService com lógica de negócio
- [ ] Implementar AlunoController com handlers HTTP
- [ ] Configurar rotas Express
- [ ] Criar componentes React (Form, Table, Modal)
- [ ] Implementar testes Cucumber em português
- [ ] Testar persistência JSON
- [ ] Validar tratamento de erros
- [ ] Documentar API REST (Swagger/OpenAPI)

---

## Dependências Necessárias

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "uuid": "^9.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@cucumber/cucumber": "^9.0.0",
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "chai": "^4.0.0",
    "mocha": "^10.0.0"
  }
}
```

---

## Considerações Importantes

1. **Atomicidade**: Todas as operações de escrita devem ser atômicas (ler → validar → escrever)
2. **Tratamento de Erros**: Sempre retornar HTTP status apropriado (400, 404, 409, 500)
3. **Validação em Camadas**: Validar no controller (formato), no service (lógica) e no repository (integridade)
4. **Isolamento de Dados**: Cada teste começa com arquivo JSON limpo
5. **Timestamps**: Sempre usar ISO8601 para datas
6. **UUIDs**: Usar v4 para IDs, não sequenciais
7. **Imutabilidade**: ID e criadoEm nunca mudam após criação
