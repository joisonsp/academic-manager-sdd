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
    } else if (message.includes('obrigatório') || message.includes('inválido') || message.includes('deve ter') || message.includes('deve conter')) {
      res.status(400).json({ erro: message });
    } else {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}
