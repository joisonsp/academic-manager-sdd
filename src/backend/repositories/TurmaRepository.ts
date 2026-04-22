// src/backend/repositories/TurmaRepository.ts

import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import {
  Turma,
  AlunoMatriculado,
  Avaliacao,
  CriarTurmaDTO,
  AtualizarTurmaDTO,
} from '../../shared/types/turma.types.js';

const TURMAS_FILE = path.join(process.cwd(), 'data', 'turmas.json');

interface TurmasData {
  turmas: Turma[];
}

export class TurmaRepository {
  async criar(dados: CriarTurmaDTO): Promise<Turma> {
    const turmas = await this.obterTodas();

    const novaTurma: Turma = {
      id: uuidv4(),
      topico: dados.topico,
      ano: dados.ano,
      semestre: dados.semestre,
      alunos: [],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    turmas.push(novaTurma);
    await this.salvarArquivo({ turmas });
    return novaTurma;
  }

  async listar(): Promise<Turma[]> {
    return this.obterTodas();
  }

  async buscarPorId(id: string): Promise<Turma | null> {
    const turmas = await this.obterTodas();
    return turmas.find(t => t.id === id) || null;
  }

  async atualizar(id: string, dados: AtualizarTurmaDTO): Promise<Turma | null> {
    const turmas = await this.obterTodas();
    const index = turmas.findIndex(t => t.id === id);
    if (index === -1) return null;

    const turmaAtualizada: Turma = {
      ...turmas[index],
      topico: dados.topico ?? turmas[index].topico,
      ano: dados.ano ?? turmas[index].ano,
      semestre: dados.semestre ?? turmas[index].semestre,
      atualizadoEm: new Date().toISOString(),
    };

    turmas[index] = turmaAtualizada;
    await this.salvarArquivo({ turmas });
    return turmaAtualizada;
  }

  async remover(id: string): Promise<boolean> {
    const turmas = await this.obterTodas();
    const index = turmas.findIndex(t => t.id === id);
    if (index === -1) return false;

    turmas.splice(index, 1);
    await this.salvarArquivo({ turmas });
    return true;
  }

  async matricularAluno(turmaId: string, alunoId: string): Promise<Turma | null> {
    const turmas = await this.obterTodas();
    const index = turmas.findIndex(t => t.id === turmaId);
    if (index === -1) return null;

    const jaMatriculado = turmas[index].alunos.some(a => a.alunoId === alunoId);
    if (!jaMatriculado) {
      const novoAluno: AlunoMatriculado = { alunoId, avaliacoes: [] };
      turmas[index].alunos.push(novoAluno);
      turmas[index].atualizadoEm = new Date().toISOString();
      await this.salvarArquivo({ turmas });
    }

    return turmas[index];
  }

  async registrarAvaliacao(
    turmaId: string,
    alunoId: string,
    avaliacao: Avaliacao
  ): Promise<Avaliacao | null> {
    const turmas = await this.obterTodas();
    const turmaIndex = turmas.findIndex(t => t.id === turmaId);
    if (turmaIndex === -1) return null;

    const alunoIndex = turmas[turmaIndex].alunos.findIndex(a => a.alunoId === alunoId);
    if (alunoIndex === -1) return null;

    const avaliacoes = turmas[turmaIndex].alunos[alunoIndex].avaliacoes;
    const avaliacaoIndex = avaliacoes.findIndex(av => av.meta === avaliacao.meta);

    if (avaliacaoIndex === -1) {
      avaliacoes.push(avaliacao);
    } else {
      avaliacoes[avaliacaoIndex] = avaliacao;
    }

    turmas[turmaIndex].atualizadoEm = new Date().toISOString();
    await this.salvarArquivo({ turmas });
    return avaliacao;
  }

  alunoEstaMatriculado(turma: Turma, alunoId: string): boolean {
    return turma.alunos.some(a => a.alunoId === alunoId);
  }

  private async obterTodas(): Promise<Turma[]> {
    try {
      const conteudo = await fs.readFile(TURMAS_FILE, 'utf-8');
      const dados: TurmasData = JSON.parse(conteudo);
      return dados.turmas;
    } catch {
      return [];
    }
  }

  private async salvarArquivo(dados: TurmasData): Promise<void> {
    await fs.writeFile(TURMAS_FILE, JSON.stringify(dados, null, 2), 'utf-8');
  }
}
