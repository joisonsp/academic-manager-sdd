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

  async listar(): Promise<Aluno[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: string): Promise<Aluno> {
    // Validar formato UUID
    if (!this.isValidUUID(id)) {
      throw new Error('ID inválido');
    }

    const aluno = await this.repository.buscarPorId(id);
    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    return aluno;
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
