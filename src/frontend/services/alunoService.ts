// src/frontend/services/alunoService.ts

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { CriarAlunoDTO, AtualizarAlunoDTO, Aluno } from '../../shared/types/aluno.types.js';

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

export class AlunoService {
  static async criar(aluno: CriarAlunoDTO): Promise<Aluno> {
    try {
      const response: AxiosResponse<Aluno> = await axios.post(
        `${API_BASE_URL}/alunos`,
        aluno,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error: any) {
      handleAxiosError(error, 'Erro ao criar aluno');
    }
  }

  static async listar(): Promise<Aluno[]> {
    try {
      const response: AxiosResponse<Aluno[]> = await axios.get(
        `${API_BASE_URL}/alunos`
      );
      return response.data;
    } catch (error: any) {
      handleAxiosError(error, 'Erro ao listar alunos');
    }
  }

  static async atualizar(id: string, dados: AtualizarAlunoDTO): Promise<Aluno> {
    try {
      const response: AxiosResponse<Aluno> = await axios.put(
        `${API_BASE_URL}/alunos/${id}`,
        dados,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error: any) {
      handleAxiosError(error, 'Erro ao atualizar aluno');
    }
  }

  static async remover(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/alunos/${id}`);
    } catch (error: any) {
      handleAxiosError(error, 'Erro ao remover aluno');
    }
  }
}

