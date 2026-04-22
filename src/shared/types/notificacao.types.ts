// src/shared/types/notificacao.types.ts

export interface ItemFila {
  id: string;
  alunoId: string;
  alunoNome: string;
  alunoEmail: string;
  meta: string;
  conceitoNovo: string;
  turmaTopico: string;
  criadoEm: string;
}

export interface FilaData {
  fila: ItemFila[];
}

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
