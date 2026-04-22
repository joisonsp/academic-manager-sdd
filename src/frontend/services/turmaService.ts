// src/frontend/services/turmaService.ts

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import {
  Turma,
  CriarTurmaDTO,
  AtualizarTurmaDTO,
  RegistrarAvaliacaoDTO,
  AvaliacaoResponse,
} from '../../shared/types/turma.types.js';

const API_BASE_URL = 'http://localhost:3000/api';

function handleAxiosError(error: any, fallback: string): never {
  if (error.response) {
    throw new Error(error.response.data.erro || fallback);
  } else if (error.request) {
    throw new Error('Erro de conexão com o servidor');
  } else {
    throw new Error('Erro interno da aplicação');
  }
}

export class TurmaService {
  static async criar(dados: CriarTurmaDTO): Promise<Turma> {
    try {
      const response: AxiosResponse<Turma> = await axios.post(
        `${API_BASE_URL}/turmas`,
        dados,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error: any) {
      handleAxiosError(error, 'Erro ao criar turma');
    }
  }

  static async listar(): Promise<Turma[]> {
    try {
      const response: AxiosResponse<Turma[]> = await axios.get(
        `${API_BASE_URL}/turmas`
      );
      return response.data;
    } catch (error: any) {
      handleAxiosError(error, 'Erro ao listar turmas');
    }
  }

  static async buscarPorId(id: string): Promise<Turma> {
    try {
      const response: AxiosResponse<Turma> = await axios.get(
        `${API_BASE_URL}/turmas/${id}`
      );
      return response.data;
    } catch (error: any) {
      handleAxiosError(error, 'Erro ao buscar turma');
    }
  }

  static async atualizar(id: string, dados: AtualizarTurmaDTO): Promise<Turma> {
    try {
      const response: AxiosResponse<Turma> = await axios.put(
        `${API_BASE_URL}/turmas/${id}`,
        dados,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error: any) {
      handleAxiosError(error, 'Erro ao atualizar turma');
    }
  }

  static async remover(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/turmas/${id}`);
    } catch (error: any) {
      handleAxiosError(error, 'Erro ao remover turma');
    }
  }

  static async matricularAluno(turmaId: string, alunoId: string): Promise<Turma> {
    try {
      const response: AxiosResponse<Turma> = await axios.post(
        `${API_BASE_URL}/turmas/${turmaId}/alunos`,
        { alunoId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error: any) {
      handleAxiosError(error, 'Erro ao matricular aluno');
    }
  }

  static async registrarAvaliacao(
    turmaId: string,
    dados: RegistrarAvaliacaoDTO
  ): Promise<AvaliacaoResponse> {
    try {
      const response: AxiosResponse<AvaliacaoResponse> = await axios.put(
        `${API_BASE_URL}/turmas/${turmaId}/avaliacoes`,
        dados,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error: any) {
      handleAxiosError(error, 'Erro ao registrar avaliação');
    }
  }
}
