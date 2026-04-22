// src/backend/services/NotificacaoService.ts

import { NotificacaoRepository } from '../repositories/NotificacaoRepository.js';
import {
  ResultadoProcessamento,
  EnvioConsolidado,
  FilaVaziaResponse,
} from '../../shared/types/notificacao.types.js';

export class NotificacaoService {
  private repository = new NotificacaoRepository();

  async processar(): Promise<ResultadoProcessamento | FilaVaziaResponse> {
    const fila = await this.repository.obterFila();

    if (fila.length === 0) {
      return { mensagem: 'Nenhuma notificacao' };
    }

    // Agrupa itens por alunoId
    const mapa = new Map<string, EnvioConsolidado>();

    for (const item of fila) {
      if (!mapa.has(item.alunoId)) {
        mapa.set(item.alunoId, {
          alunoId: item.alunoId,
          alunoNome: item.alunoNome,
          alunoEmail: item.alunoEmail,
          avaliacoes: [],
        });
      }
      mapa.get(item.alunoId)!.avaliacoes.push({
        meta: item.meta,
        conceitoNovo: item.conceitoNovo,
      });
    }

    const envios = Array.from(mapa.values());

    // Simula envio de e-mail
    for (const envio of envios) {
      const metas = envio.avaliacoes.map((a) => `${a.meta}=${a.conceitoNovo}`).join(', ');
      console.log(
        `[Notificacao] Enviando e-mail para ${envio.alunoNome} <${envio.alunoEmail}> | Avaliações: ${metas}`
      );
    }

    // Esvazia a fila após processamento
    await this.repository.esvaziarFila();

    return {
      totalEnvios: envios.length,
      envios,
    };
  }
}
