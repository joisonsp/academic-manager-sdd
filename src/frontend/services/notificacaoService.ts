// src/frontend/services/notificacaoService.ts

import axios from 'axios';

const API_URL = 'http://localhost:3000';

export interface AvaliacaoEnviada {
  meta: string;
  conceitoNovo: string;
}

export interface EnvioConsolidado {
  alunoId: string;
  alunoNome: string;
  alunoEmail: string;
  avaliacoes: AvaliacaoEnviada[];
}

export interface ResultadoProcessamento {
  totalEnvios: number;
  envios: EnvioConsolidado[];
}

export interface FilaVaziaResponse {
  mensagem: string;
}

export type RespostaProcessamento = ResultadoProcessamento | FilaVaziaResponse;

export class NotificacaoService {
  static async processarBatch(): Promise<RespostaProcessamento> {
    const response = await axios.post<RespostaProcessamento>(
      `${API_URL}/api/notificacoes/processar`
    );
    return response.data;
  }
}
