// src/shared/types/turma.types.ts

export type Conceito = 'MANA' | 'MPA' | 'MA';

export const CONCEITOS_VALIDOS: Conceito[] = ['MANA', 'MPA', 'MA'];

export interface Avaliacao {
  meta: string;
  conceito: Conceito;
}

export interface AlunoMatriculado {
  alunoId: string;
  avaliacoes: Avaliacao[];
}

export interface Turma {
  id: string;
  topico: string;
  ano: number;
  semestre: number;
  alunos: AlunoMatriculado[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface CriarTurmaDTO {
  topico: string;
  ano: number;
  semestre: number;
}

export interface AtualizarTurmaDTO {
  topico?: string;
  ano?: number;
  semestre?: number;
}

export interface RegistrarAvaliacaoDTO {
  alunoId: string;
  meta: string;
  conceito: string;
}

export interface AvaliacaoResponse {
  alunoId: string;
  meta: string;
  conceito: Conceito;
}
