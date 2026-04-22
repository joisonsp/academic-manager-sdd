// src/shared/types/aluno.types.ts

export interface Aluno {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  criadoEm: string;
  atualizadoEm: string;
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

export interface ErroResposta {
  erro: string;
  codigo?: number;
}
