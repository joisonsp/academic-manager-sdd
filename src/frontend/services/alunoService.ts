
// src/frontend/services/alunoService.ts  

import axios, { AxiosResponse } from 'axios';
import { CriarAlunoDTO, Aluno } from '../../shared/types/aluno.types.js';

const API_BASE_URL = 'http://localhost:3000/api';

export class AlunoService {
  static async criar(aluno: CriarAlunoDTO): Promise<Aluno> {
    try {
      const response: AxiosResponse<Aluno> = await axios.post(
        `${API_BASE_URL}/alunos`,
        aluno,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Server responded with error status  
        throw new Error(error.response.data.erro || 'Erro desconhecido');
      } else if (error.request) {
        // Request was made but no response received  
        throw new Error('Erro de conexao com o servidor');
      } else {
        // Something else happened  
        throw new Error('Erro interno da aplicacao');
      }
    }
  }
} 
