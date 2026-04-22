// src/backend/repositories/AlunoRepository.ts

import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Aluno, CriarAlunoDTO, AtualizarAlunoDTO } from '../../shared/types/aluno.types.js';

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

  async cpfExistePorOutroAluno(cpf: string, excludeId: string): Promise<boolean> {
    const alunos = await this.obterTodos();
    return alunos.some(a => a.cpf === cpf && a.id !== excludeId);
  }

  async emailExiste(email: string): Promise<boolean> {
    const alunos = await this.obterTodos();
    return alunos.some(a => a.email === email);
  }

  async emailExistePorOutroAluno(email: string, excludeId: string): Promise<boolean> {
    const alunos = await this.obterTodos();
    return alunos.some(a => a.email === email && a.id !== excludeId);
  }

  async atualizar(id: string, dados: AtualizarAlunoDTO): Promise<Aluno | null> {
    const alunos = await this.obterTodos();
    const index = alunos.findIndex(a => a.id === id);
    if (index === -1) return null;

    const alunoAtualizado: Aluno = {
      ...alunos[index],
      nome: dados.nome ?? alunos[index].nome,
      cpf: dados.cpf ?? alunos[index].cpf,
      email: dados.email ?? alunos[index].email,
      atualizadoEm: new Date().toISOString(),
    };

    alunos[index] = alunoAtualizado;
    await this.salvarArquivo({ alunos });
    return alunoAtualizado;
  }

  async remover(id: string): Promise<boolean> {
    const alunos = await this.obterTodos();
    const index = alunos.findIndex(a => a.id === id);
    if (index === -1) return false;

    alunos.splice(index, 1);
    await this.salvarArquivo({ alunos });
    return true;
  }

  async listar(): Promise<Aluno[]> {
    return this.obterTodos();
  }

  async buscarPorId(id: string): Promise<Aluno | null> {
    const alunos = await this.obterTodos();
    return alunos.find(a => a.id === id) || null;
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
