// src/backend/controllers/TurmaController.ts

import { Request, Response } from 'express';
import { TurmaService } from '../services/TurmaService.js';

export class TurmaController {
  private service = new TurmaService();

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const turma = await this.service.criar(req.body);
      res.status(201).json(turma);
    } catch (erro) {
      this.handleError(res, erro);
    }
  }

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const turmas = await this.service.listar();
      res.status(200).json(turmas);
    } catch (erro) {
      this.handleError(res, erro);
    }
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const turma = await this.service.buscarPorId(id);
      res.status(200).json(turma);
    } catch (erro) {
      this.handleError(res, erro);
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const turma = await this.service.atualizar(id, req.body);
      res.status(200).json(turma);
    } catch (erro) {
      this.handleError(res, erro);
    }
  }

  async remover(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.remover(id);
      res.status(200).json({ mensagem: 'Turma removida com sucesso' });
    } catch (erro) {
      this.handleError(res, erro);
    }
  }

  async matricularAluno(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { alunoId } = req.body;

      if (!alunoId) {
        res.status(400).json({ erro: 'ID do aluno é obrigatório' });
        return;
      }

      const turma = await this.service.matricularAluno(id, alunoId);
      res.status(200).json(turma);
    } catch (erro) {
      this.handleError(res, erro);
    }
  }

  async registrarAvaliacao(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const avaliacao = await this.service.registrarAvaliacao(id, req.body);
      res.status(200).json(avaliacao);
    } catch (erro) {
      this.handleError(res, erro);
    }
  }

  private handleError(res: Response, erro: unknown): void {
    const message = erro instanceof Error ? erro.message : 'Erro desconhecido';

    if (message === 'Turma não encontrada' || message === 'Aluno não matriculado') {
      res.status(404).json({ erro: message });
    } else if (
      message.includes('obrigatório') ||
      message.includes('inválido') ||
      message.includes('deve ter') ||
      message.includes('deve conter')
    ) {
      res.status(400).json({ erro: message });
    } else {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}
