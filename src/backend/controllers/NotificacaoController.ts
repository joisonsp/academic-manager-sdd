// src/backend/controllers/NotificacaoController.ts

import { Request, Response } from 'express';
import { NotificacaoService } from '../services/NotificacaoService.js';

export class NotificacaoController {
  private service = new NotificacaoService();

  async processar(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await this.service.processar();
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(500).json({ erro: error.message ?? 'Erro interno ao processar notificações' });
    }
  }
}
