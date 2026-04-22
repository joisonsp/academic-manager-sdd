// src/backend/services/AlunoService.ts

import { CriarAlunoDTO, Aluno } from '../../shared/types/aluno.types.js';
import { AlunoValidator } from '../validators/AlunoValidator.js';
import { AlunoRepository } from '../repositories/AlunoRepository.js';

export class AlunoService {
  private validator = new AlunoValidator();
  private repository = new AlunoRepository();

  async criar(dados: CriarAlunoDTO): Promise<Aluno> {
    // Validar dados
    await this.validator.validarCriacao(dados);

    // Criar e persistir
    return this.repository.criar(dados);
  }
}
