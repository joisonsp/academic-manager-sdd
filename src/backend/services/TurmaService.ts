// src/backend/services/TurmaService.ts

import {
  Turma,
  CriarTurmaDTO,
  AtualizarTurmaDTO,
  RegistrarAvaliacaoDTO,
  AvaliacaoResponse,
  CONCEITOS_VALIDOS,
  Conceito,
} from '../../shared/types/turma.types.js';
import { TurmaRepository } from '../repositories/TurmaRepository.js';
import { AlunoRepository } from '../repositories/AlunoRepository.js';
import { NotificacaoRepository } from '../repositories/NotificacaoRepository.js';

export class TurmaService {
  private repository = new TurmaRepository();
  private alunoRepository = new AlunoRepository();
  private notificacaoRepository = new NotificacaoRepository();

  async criar(dados: CriarTurmaDTO): Promise<Turma> {
    if (!dados.topico || dados.topico.trim() === '') {
      throw new Error('Tópico é obrigatório');
    }

    if (dados.ano === undefined || dados.ano === null || Number.isNaN(dados.ano)) {
      throw new Error('Ano é obrigatório');
    }

    if (dados.semestre === undefined || dados.semestre === null || Number.isNaN(dados.semestre)) {
      throw new Error('Semestre é obrigatório');
    }

    return this.repository.criar(dados);
  }

  async listar(): Promise<Turma[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: string): Promise<Turma> {
    const turma = await this.repository.buscarPorId(id);
    if (!turma) {
      throw new Error('Turma não encontrada');
    }
    return turma;
  }

  async atualizar(id: string, dados: AtualizarTurmaDTO): Promise<Turma> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) {
      throw new Error('Turma não encontrada');
    }

    if (dados.topico !== undefined && dados.topico.trim() === '') {
      throw new Error('Tópico é obrigatório');
    }

    const atualizada = await this.repository.atualizar(id, dados);
    return atualizada!;
  }

  async remover(id: string): Promise<void> {
    const removida = await this.repository.remover(id);
    if (!removida) {
      throw new Error('Turma não encontrada');
    }
  }

  async matricularAluno(turmaId: string, alunoId: string): Promise<Turma> {
    const turma = await this.repository.buscarPorId(turmaId);
    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    const atualizada = await this.repository.matricularAluno(turmaId, alunoId);
    return atualizada!;
  }

  async registrarAvaliacao(
    turmaId: string,
    dados: RegistrarAvaliacaoDTO
  ): Promise<AvaliacaoResponse> {
    if (!CONCEITOS_VALIDOS.includes(dados.conceito as Conceito)) {
      throw new Error('Conceito inválido');
    }

    const turma = await this.repository.buscarPorId(turmaId);
    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    if (!this.repository.alunoEstaMatriculado(turma, dados.alunoId)) {
      throw new Error('Aluno não matriculado');
    }

    const avaliacao = await this.repository.registrarAvaliacao(turmaId, dados.alunoId, {
      meta: dados.meta,
      conceito: dados.conceito as Conceito,
    });

    // Enfileira notificação de forma não-bloqueante (falha silenciosa para não quebrar a avaliação)
    try {
      const aluno = await this.alunoRepository.buscarPorId(dados.alunoId);
      await this.notificacaoRepository.adicionarNaFila({
        alunoId: dados.alunoId,
        alunoNome: aluno?.nome ?? '',
        alunoEmail: aluno?.email ?? '',
        meta: dados.meta,
        conceitoNovo: dados.conceito as string,
        turmaTopico: turma.topico,
      });
    } catch {
      // Falha silenciosa — a notificação não deve bloquear o registro da avaliação
    }

    return {
      alunoId: dados.alunoId,
      meta: dados.meta,
      conceito: avaliacao!.conceito,
    };
  }
}
