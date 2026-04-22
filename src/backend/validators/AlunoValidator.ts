// src/backend/validators/AlunoValidator.ts

import { CriarAlunoDTO, AtualizarAlunoDTO } from '../../shared/types/aluno.types.js';
import { AlunoRepository } from '../repositories/AlunoRepository.js';

export class AlunoValidator {
  private repository = new AlunoRepository();

  async validarCriacao(dados: CriarAlunoDTO): Promise<void> {
    // 1. Nome obrigatório
    if (!dados.nome || dados.nome.trim() === '') {
      throw new Error('Nome é obrigatório');
    }

    // 2. Nome mínimo 3 chars
    if (dados.nome.trim().length < 3) {
      throw new Error('Nome deve ter no mínimo 3 caracteres');
    }

    // 3. CPF obrigatório
    if (!dados.cpf || dados.cpf.trim() === '') {
      throw new Error('CPF é obrigatório');
    }

    // 4. CPF 11 dígitos
    if (!/^\d{11}$/.test(dados.cpf)) {
      throw new Error('CPF deve conter 11 dígitos');
    }

    // 5. CPF único
    const cpfExiste = await this.repository.cpfExiste(dados.cpf);
    if (cpfExiste) {
      throw new Error('CPF já cadastrado');
    }

    // 6. Email obrigatório
    if (!dados.email || dados.email.trim() === '') {
      throw new Error('E-mail é obrigatório');
    }

    // 7. Email válido
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(dados.email)) {
      throw new Error('E-mail inválido');
    }

    // 8. Email único
    const emailExiste = await this.repository.emailExiste(dados.email);
    if (emailExiste) {
      throw new Error('E-mail já cadastrado');
    }
  }

  async validarAtualizacao(id: string, dados: AtualizarAlunoDTO): Promise<void> {
    if (dados.nome !== undefined) {
      if (dados.nome.trim() === '') {
        throw new Error('Nome é obrigatório');
      }
      if (dados.nome.trim().length < 3) {
        throw new Error('Nome deve ter no mínimo 3 caracteres');
      }
    }

    if (dados.cpf !== undefined) {
      if (dados.cpf.trim() === '') {
        throw new Error('CPF é obrigatório');
      }
      if (!/^\d{11}$/.test(dados.cpf)) {
        throw new Error('CPF deve conter 11 dígitos');
      }
      const cpfDuplicado = await this.repository.cpfExistePorOutroAluno(dados.cpf, id);
      if (cpfDuplicado) {
        throw new Error('CPF já cadastrado');
      }
    }

    if (dados.email !== undefined) {
      if (dados.email.trim() === '') {
        throw new Error('E-mail é obrigatório');
      }
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(dados.email)) {
        throw new Error('E-mail inválido');
      }
      const emailDuplicado = await this.repository.emailExistePorOutroAluno(dados.email, id);
      if (emailDuplicado) {
        throw new Error('E-mail já cadastrado');
      }
    }
  }
}
